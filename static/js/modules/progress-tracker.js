/**
 * Progress Tracker Module
 * Tracks user progress through the tax filing process and provides analytics
 */

const ProgressTracker = (function() {
    // Private variables
    let currentStep = 0;
    let totalSteps = 0;
    let startTime = null;
    let stepTimes = {};
    let completedSections = {};
    let savedData = {};

    // Private methods
    function saveProgress() {
        const progressData = {
            currentStep,
            totalSteps,
            startTime,
            stepTimes,
            completedSections,
            savedData,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('taxFilingProgress', JSON.stringify(progressData));

        // Dispatch event for other modules to react to progress changes
        window.dispatchEvent(new CustomEvent('progress-updated', {
            detail: {
                currentStep,
                totalSteps,
                percent: Math.round((currentStep / totalSteps) * 100)
            }
        }));
    }

    function loadProgress() {
        const savedProgress = localStorage.getItem('taxFilingProgress');
        if (savedProgress) {
            try {
                const progressData = JSON.parse(savedProgress);
                currentStep = progressData.currentStep || 0;
                totalSteps = progressData.totalSteps || 0;
                startTime = progressData.startTime || null;
                stepTimes = progressData.stepTimes || {};
                completedSections = progressData.completedSections || {};
                savedData = progressData.savedData || {};

                return true;
            } catch (error) {
                console.error('Error loading progress:', error);
                return false;
            }
        }
        return false;
    }

    function formatTime(milliseconds) {
        if (!milliseconds) return '0 seconds';

        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`;
        } else {
            return `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }
    }

    function calculateTimeRemaining() {
        if (currentStep === 0 || Object.keys(stepTimes).length === 0) {
            return 'Calculating...';
        }

        // Calculate average time per step
        let totalTimeSpent = 0;
        let stepsWithTime = 0;

        for (const step in stepTimes) {
            if (stepTimes[step]) {
                totalTimeSpent += stepTimes[step];
                stepsWithTime++;
            }
        }

        if (stepsWithTime === 0) return 'Calculating...';

        const averageTimePerStep = totalTimeSpent / stepsWithTime;
        const stepsRemaining = totalSteps - currentStep;
        const estimatedTimeRemaining = averageTimePerStep * stepsRemaining;

        return formatTime(estimatedTimeRemaining);
    }

    // Public methods
    return {
        init: function(steps) {
            totalSteps = steps;

            // Try to load saved progress
            if (!loadProgress()) {
                // If no saved progress, initialize new session
                startTime = new Date().toISOString();
                currentStep = 0;
                stepTimes = {};
                completedSections = {};
                savedData = {};
                saveProgress();
            }

            // Update UI elements
            this.updateProgressUI();

            return {
                currentStep,
                totalSteps,
                percent: Math.round((currentStep / totalSteps) * 100)
            };
        },

        advanceStep: function(stepData = {}) {
            // Record time spent on current step
            if (currentStep > 0) {
                const stepKey = `step_${currentStep}`;
                const stepStartTime = new Date(stepTimes[`${stepKey}_start`] || startTime);
                const stepEndTime = new Date();
                const timeSpent = stepEndTime - stepStartTime;

                stepTimes[stepKey] = timeSpent;
            }

            // Move to next step
            currentStep++;

            // Record start time for new step
            stepTimes[`step_${currentStep}_start`] = new Date().toISOString();

            // Save any data associated with this step
            if (Object.keys(stepData).length > 0) {
                savedData[`step_${currentStep}`] = stepData;
            }

            // Save progress
            saveProgress();

            // Update UI
            this.updateProgressUI();

            return {
                currentStep,
                totalSteps,
                percent: Math.round((currentStep / totalSteps) * 100)
            };
        },

        goToStep: function(step, stepData = {}) {
            if (step < 1 || step > totalSteps) {
                console.error(`Invalid step: ${step}. Must be between 1 and ${totalSteps}`);
                return null;
            }

            // Record time spent on current step
            if (currentStep > 0) {
                const stepKey = `step_${currentStep}`;
                const stepStartTime = new Date(stepTimes[`${stepKey}_start`] || startTime);
                const stepEndTime = new Date();
                const timeSpent = stepEndTime - stepStartTime;

                stepTimes[stepKey] = timeSpent;
            }

            // Set new current step
            currentStep = step;

            // Record start time for new step
            stepTimes[`step_${currentStep}_start`] = new Date().toISOString();

            // Save any data associated with this step
            if (Object.keys(stepData).length > 0) {
                savedData[`step_${currentStep}`] = stepData;
            }

            // Save progress
            saveProgress();

            // Update UI
            this.updateProgressUI();

            return {
                currentStep,
                totalSteps,
                percent: Math.round((currentStep / totalSteps) * 100)
            };
        },

        completeSection: function(sectionId, data = {}) {
            completedSections[sectionId] = {
                completedAt: new Date().toISOString(),
                data
            };

            saveProgress();

            return completedSections;
        },

        isSectionCompleted: function(sectionId) {
            return !!completedSections[sectionId];
        },

        getSectionData: function(sectionId) {
            return completedSections[sectionId]?.data || null;
        },

        saveData: function(key, value) {
            savedData[key] = value;
            saveProgress();
        },

        getData: function(key) {
            return savedData[key] || null;
        },

        getAllData: function() {
            return savedData;
        },

        getProgress: function() {
            return {
                currentStep,
                totalSteps,
                percent: Math.round((currentStep / totalSteps) * 100),
                timeSpent: this.getTotalTimeSpent(),
                estimatedTimeRemaining: calculateTimeRemaining(),
                completedSections: Object.keys(completedSections).length
            };
        },

        getTotalTimeSpent: function() {
            let totalTime = 0;

            for (const key in stepTimes) {
                if (!key.includes('_start') && stepTimes[key]) {
                    totalTime += stepTimes[key];
                }
            }

            return formatTime(totalTime);
        },

        updateProgressUI: function() {
            // Update progress bar
            const progressBar = document.querySelector('.filing-progress-fill');
            if (progressBar) {
                const percent = Math.round((currentStep / totalSteps) * 100);
                progressBar.style.width = `${percent}%`;
            }

            // Update step indicators
            const stepIndicators = document.querySelectorAll('.step-indicator');
            if (stepIndicators.length > 0) {
                stepIndicators.forEach((indicator, index) => {
                    const stepNumber = index + 1;

                    indicator.classList.remove('active', 'completed');

                    if (stepNumber === currentStep) {
                        indicator.classList.add('active');
                    } else if (stepNumber < currentStep) {
                        indicator.classList.add('completed');
                    }
                });
            }

            // Update progress tracker
            const progressTracker = document.querySelector('.progress-tracker');
            if (progressTracker) {
                const percent = Math.round((currentStep / totalSteps) * 100);
                progressTracker.setAttribute('data-progress', percent);

                const progressSteps = progressTracker.querySelectorAll('.progress-step');
                progressSteps.forEach((step, index) => {
                    const stepNumber = index + 1;

                    step.classList.remove('active', 'completed');

                    if (stepNumber === currentStep) {
                        step.classList.add('active');
                    } else if (stepNumber < currentStep) {
                        step.classList.add('completed');
                    }
                });
            }

            // Update time estimates
            const timeRemaining = document.getElementById('estimated-time-remaining');
            if (timeRemaining) {
                timeRemaining.textContent = calculateTimeRemaining();
            }

            const timeSpent = document.getElementById('total-time-spent');
            if (timeSpent) {
                timeSpent.textContent = this.getTotalTimeSpent();
            }
        },

        reset: function() {
            localStorage.removeItem('taxFilingProgress');
            currentStep = 0;
            totalSteps = 0;
            startTime = null;
            stepTimes = {};
            completedSections = {};
            savedData = {};

            return true;
        },

        generateProgressReport: function() {
            const now = new Date();
            const startDate = startTime ? new Date(startTime) : now;
            const totalTimeSpent = this.getTotalTimeSpent();

            const report = {
                startDate: startDate.toLocaleString(),
                currentDate: now.toLocaleString(),
                progress: {
                    currentStep,
                    totalSteps,
                    percentComplete: Math.round((currentStep / totalSteps) * 100)
                },
                timeMetrics: {
                    totalTimeSpent,
                    estimatedTimeRemaining: calculateTimeRemaining(),
                    averageTimePerStep: formatTime(Object.values(stepTimes).filter(time => typeof time === 'number').reduce((sum, time) => sum + time, 0) / currentStep)
                },
                completedSections: Object.keys(completedSections).map(sectionId => ({
                    sectionId,
                    completedAt: new Date(completedSections[sectionId].completedAt).toLocaleString()
                }))
            };

            return report;
        }
    };
})();

// Export the module
window.ProgressTracker = ProgressTracker;
