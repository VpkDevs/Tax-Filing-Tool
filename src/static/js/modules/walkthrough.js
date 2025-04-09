/**
 * Tax Filing Walkthrough Module
 * Provides comprehensive step-by-step guidance for users unfamiliar with tax filing
 */

const TaxWalkthrough = (function() {
    // Private variables
    let currentStep = 0;
    const totalSteps = 7;

    // Steps data with extremely detailed explanations for absolute beginners
    const steps = [
        {
            title: "What is Tax Filing?",
            content: `
                <div class="walkthrough-content">
                    <h3>Tax Filing Basics for Complete Beginners</h3>
                    <p>If you've never filed taxes before, don't worry! We'll explain everything in simple terms:</p>

                    <div class="beginner-box">
                        <h4><i class="fas fa-question-circle"></i> What is a tax return?</h4>
                        <p>A tax return is simply a form you fill out to tell the government:</p>
                        <ul class="simple-list">
                            <li>How much money you made during the year</li>
                            <li>How much tax was already taken from your paychecks</li>
                            <li>If you qualify for any tax benefits (called "credits" or "deductions")</li>
                        </ul>
                        <p>After filling this out, you'll find out if you get money back (a refund) or if you need to pay more.</p>
                    </div>

                    <div class="beginner-box">
                        <h4><i class="fas fa-calendar-alt"></i> What is a "prior year" tax return?</h4>
                        <p>A "prior year" return simply means filing taxes for a previous year that has already passed.</p>
                        <p>In this case, we're helping you file for 2021 (even though it's now 2025).</p>
                        <p>This is completely legal and normal! The IRS allows you to claim refunds for up to 3 years after the original due date.</p>
                    </div>

                    <div class="beginner-box">
                        <h4><i class="fas fa-hand-holding-usd"></i> What is the Recovery Rebate Credit?</h4>
                        <p>During the COVID-19 pandemic, the government sent stimulus payments to help people financially.</p>
                        <p>The third stimulus payment of up to $1,400 per person was sent in 2021.</p>
                        <p>If you never received this payment (or got less than you should have), you can claim it now as the "Recovery Rebate Credit" on your 2021 tax return.</p>
                        <p>This means you could get up to $1,400 per person in your household!</p>
                    </div>

                    <div class="walkthrough-note">
                        <i class="fas fa-info-circle"></i>
                        <p>Don't worry about remembering all this! Our tool will guide you through every tiny step of the process, explain all tax terms as we go, and provide all necessary forms.</p>
                    </div>
                </div>
            `,
            resources: [
                { name: "Tax Filing Basics Video", link: "#", description: "Watch our 3-minute video explaining tax filing for beginners" },
                { name: "Recovery Rebate Credit Explained", link: "#", description: "Simple explanation of the stimulus payment credit" }
            ]
        },
        {
            title: "Do I Need to File?",
            content: `
                <div class="walkthrough-content">
                    <h3>Should You File a 2021 Tax Return?</h3>
                    <p>Let's figure out if filing a 2021 tax return makes sense for you:</p>

                    <div class="decision-tree">
                        <div class="decision-question">
                            <i class="fas fa-money-bill-wave"></i>
                            <h4>Did you receive the third stimulus payment in 2021?</h4>
                            <p>This was a payment of up to $1,400 per person that most people received in March-April 2021.</p>
                            <div class="decision-options">
                                <div class="decision-option">
                                    <span class="option-label">No, I didn't receive it</span>
                                    <span class="option-result success">You should definitely file! You may be eligible to receive up to $1,400 per person in your household.</span>
                                </div>
                                <div class="decision-option">
                                    <span class="option-label">I'm not sure</span>
                                    <span class="option-result success">You should file to make sure you don't miss out on money you're entitled to.</span>
                                </div>
                                <div class="decision-option">
                                    <span class="option-label">Yes, I received it</span>
                                    <span class="option-result">Continue to the next question.</span>
                                </div>
                            </div>
                        </div>

                        <div class="decision-question">
                            <i class="fas fa-hand-holding-usd"></i>
                            <h4>Did you have any income in 2021?</h4>
                            <p>This includes jobs, self-employment, unemployment benefits, etc.</p>
                            <div class="decision-options">
                                <div class="decision-option">
                                    <span class="option-label">Yes, I had income</span>
                                    <span class="option-result success">You should file! You might be eligible for tax refunds or other credits.</span>
                                </div>
                                <div class="decision-option">
                                    <span class="option-label">No, I had no income</span>
                                    <span class="option-result">You may still want to file to claim the Recovery Rebate Credit if you didn't receive the full stimulus payment.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="walkthrough-note highlight">
                        <i class="fas fa-lightbulb"></i>
                        <p><strong>Good news!</strong> Even if you've never filed taxes before, our tool makes it easy to file your 2021 return and claim any money you're owed.</p>
                    </div>
                </div>
            `,
            resources: [
                { name: "Stimulus Payment Checker", link: "#", description: "Tool to help you remember if you received the stimulus" },
                { name: "Income Types Explained", link: "#", description: "Simple guide to different types of income" }
            ]
        },
        {
            title: "Gathering Your Information",
            content: `
                <div class="walkthrough-content">
                    <h3>What Information Will You Need?</h3>
                    <p>Don't worry if you don't have everything - we'll help you through each step!</p>

                    <div class="beginner-steps">
                        <div class="beginner-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Basic Personal Information</h4>
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-user"></i></div>
                                    <div class="info-details">
                                        <h5>Your Full Name</h5>
                                        <p>Exactly as it appears on your Social Security card</p>
                                        <div class="example-box">
                                            <span class="example-label">Example:</span> John Michael Smith (not Johnny Smith)
                                        </div>
                                    </div>
                                </div>

                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-id-card"></i></div>
                                    <div class="info-details">
                                        <h5>Social Security Number (SSN)</h5>
                                        <p>Your 9-digit number assigned by the Social Security Administration</p>
                                        <div class="example-box">
                                            <span class="example-label">Example:</span> 123-45-6789
                                        </div>
                                        <div class="help-tip">
                                            <i class="fas fa-question-circle"></i>
                                            <span>Can't find your SSN? It's on your Social Security card, W-2 forms, or previous tax returns.</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-home"></i></div>
                                    <div class="info-details">
                                        <h5>Your Address</h5>
                                        <p>Where you lived at the end of 2021</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="beginner-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Income Information (if you had any)</h4>
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-file-alt"></i></div>
                                    <div class="info-details">
                                        <h5>W-2 Form</h5>
                                        <p>This form shows how much you earned from your job and how much tax was withheld</p>
                                        <div class="example-box">
                                            <span class="example-label">What it looks like:</span>
                                            <img src="./static/images/w2-example.jpg" alt="W-2 Form Example" class="document-example-img">
                                        </div>
                                        <div class="help-tip">
                                            <i class="fas fa-question-circle"></i>
                                            <span>Don't have your W-2? Your employer should have sent it to you by January 31, 2022. We can help you estimate this information if needed.</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-file-invoice-dollar"></i></div>
                                    <div class="info-details">
                                        <h5>Other Income Forms (if applicable)</h5>
                                        <p>You might have received other forms like:</p>
                                        <ul class="simple-list">
                                            <li>Form 1099-G (for unemployment benefits)</li>
                                            <li>Form 1099-NEC or 1099-MISC (for self-employment or contract work)</li>
                                            <li>Form 1099-INT (for interest earned)</li>
                                        </ul>
                                        <div class="help-tip">
                                            <i class="fas fa-question-circle"></i>
                                            <span>Don't worry if you don't have these - we'll walk you through what you need based on your situation.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="beginner-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Stimulus Payment Information</h4>
                                <div class="info-item highlight">
                                    <div class="info-icon"><i class="fas fa-hand-holding-usd"></i></div>
                                    <div class="info-details">
                                        <h5>Letter 6475 or Stimulus Payment Record</h5>
                                        <p>Information about the third stimulus payment you received (or didn't receive) in 2021</p>
                                        <div class="example-box">
                                            <span class="example-label">What Letter 6475 looks like:</span>
                                            <img src="./static/images/letter-6475-example.jpg" alt="Letter 6475 Example" class="document-example-img">
                                        </div>
                                        <div class="help-tip">
                                            <i class="fas fa-lightbulb"></i>
                                            <span>Don't have this letter? Don't worry! Our tool includes a special helper to determine if you received the payment.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="beginner-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>For Your Refund (Optional)</h4>
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-university"></i></div>
                                    <div class="info-details">
                                        <h5>Bank Account Information</h5>
                                        <p>If you want your refund directly deposited to your bank account (fastest method)</p>
                                        <ul class="simple-list">
                                            <li>Bank routing number (9 digits)</li>
                                            <li>Account number</li>
                                            <li>Account type (checking or savings)</li>
                                        </ul>
                                        <div class="example-box">
                                            <span class="example-label">Where to find this:</span> On your checks, bank statements, or banking app
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="walkthrough-note highlight">
                        <i class="fas fa-heart"></i>
                        <div>
                            <p><strong>Don't stress about missing documents!</strong></p>
                            <p>Our tool is designed to help even if you're missing information. We'll guide you through alternatives and help you estimate when needed.</p>
                        </div>
                    </div>
                </div>
            `,
            resources: [
                { name: "Document Checklist PDF", link: "#", description: "Printable checklist of all documents needed" },
                { name: "How to Request Missing W-2s", link: "#", description: "Guide to obtaining missing tax documents" },
                { name: "Bank Information Helper", link: "#", description: "Guide to finding your bank account and routing numbers" }
            ]
        },
        {
            title: "Your Filing Status",
            content: `
                <div class="walkthrough-content">
                    <h3>What Was Your Situation in 2021?</h3>
                    <p>Your "filing status" is just a category that describes your family situation. Let's figure out which one fits you!</p>

                    <div class="interactive-selector">
                        <div class="selector-question">
                            <i class="fas fa-ring"></i>
                            <h4>Were you married on December 31, 2021?</h4>
                        </div>

                        <div class="selector-options">
                            <div class="selector-option" data-next="married">
                                <div class="option-icon"><i class="fas fa-check"></i></div>
                                <div class="option-text">Yes, I was married</div>
                            </div>

                            <div class="selector-option" data-next="single">
                                <div class="option-icon"><i class="fas fa-times"></i></div>
                                <div class="option-text">No, I was not married</div>
                            </div>
                        </div>
                    </div>

                    <div class="selector-result" id="married" style="display: none;">
                        <div class="result-header">
                            <i class="fas fa-user-friends"></i>
                            <h4>For Married People</h4>
                        </div>

                        <p>You have two options:</p>

                        <div class="status-card recommended">
                            <div class="status-header">
                                <h5>Married Filing Jointly</h5>
                                <span class="recommended-badge">Recommended for most couples</span>
                            </div>
                            <div class="status-body">
                                <p>This means you and your spouse file one tax return together.</p>
                                <div class="status-benefits">
                                    <h6><i class="fas fa-plus-circle"></i> Benefits:</h6>
                                    <ul class="simple-list">
                                        <li>Usually results in lower taxes</li>
                                        <li>Higher standard deduction ($25,100 for 2021)</li>
                                        <li>Access to more tax credits and deductions</li>
                                    </ul>
                                </div>
                                <div class="status-example">
                                    <h6><i class="fas fa-user-check"></i> Choose this if:</h6>
                                    <p>You were married on December 31, 2021, and both you and your spouse agree to file together.</p>
                                </div>
                            </div>
                        </div>

                        <div class="status-card">
                            <div class="status-header">
                                <h5>Married Filing Separately</h5>
                            </div>
                            <div class="status-body">
                                <p>This means you and your spouse each file your own separate tax return.</p>
                                <div class="status-benefits">
                                    <h6><i class="fas fa-info-circle"></i> Important to know:</h6>
                                    <ul class="simple-list">
                                        <li>Usually results in higher taxes</li>
                                        <li>Lower standard deduction ($12,550 for 2021)</li>
                                        <li>Many tax credits are not available</li>
                                    </ul>
                                </div>
                                <div class="status-example">
                                    <h6><i class="fas fa-user-check"></i> Choose this if:</h6>
                                    <p>You want to be responsible only for your own taxes, or you're separated but not legally divorced.</p>
                                </div>
                            </div>
                        </div>

                        <div class="status-note">
                            <i class="fas fa-lightbulb"></i>
                            <p>For most married couples, <strong>Married Filing Jointly</strong> results in lower taxes and is simpler.</p>
                        </div>
                    </div>

                    <div class="selector-result" id="single" style="display: none;">
                        <div class="result-header">
                            <i class="fas fa-user"></i>
                            <h4>For Unmarried People</h4>
                        </div>

                        <p>You have two main options:</p>

                        <div class="status-card">
                            <div class="status-header">
                                <h5>Single</h5>
                            </div>
                            <div class="status-body">
                                <p>This is the basic filing status for unmarried people.</p>
                                <div class="status-benefits">
                                    <h6><i class="fas fa-info-circle"></i> Important to know:</h6>
                                    <ul class="simple-list">
                                        <li>Standard deduction: $12,550 for 2021</li>
                                    </ul>
                                </div>
                                <div class="status-example">
                                    <h6><i class="fas fa-user-check"></i> Choose this if:</h6>
                                    <p>You were unmarried, divorced, or legally separated on December 31, 2021, and don't qualify for Head of Household.</p>
                                </div>
                            </div>
                        </div>

                        <div class="status-card recommended">
                            <div class="status-header">
                                <h5>Head of Household</h5>
                                <span class="recommended-badge">Better if you qualify</span>
                            </div>
                            <div class="status-body">
                                <p>This status is for unmarried people who pay for more than half the cost of keeping up a home for themselves and a qualifying person.</p>
                                <div class="status-benefits">
                                    <h6><i class="fas fa-plus-circle"></i> Benefits:</h6>
                                    <ul class="simple-list">
                                        <li>Lower tax rates than Single</li>
                                        <li>Higher standard deduction ($18,800 for 2021)</li>
                                        <li>Access to more tax credits</li>
                                    </ul>
                                </div>
                                <div class="status-example">
                                    <h6><i class="fas fa-user-check"></i> You might qualify if:</h6>
                                    <p>You were unmarried AND:</p>
                                    <ul class="simple-list">
                                        <li>You paid more than half the cost of keeping up your home in 2021, AND</li>
                                        <li>A qualifying person (like your child) lived with you for more than half of 2021</li>
                                    </ul>
                                    <div class="help-tip">
                                        <i class="fas fa-question-circle"></i>
                                        <span>Not sure if you qualify? Our tool will help you determine this based on your answers to simple questions.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="status-note">
                            <i class="fas fa-lightbulb"></i>
                            <p>If you have a child or dependent who lived with you, check if you qualify for <strong>Head of Household</strong> status, as it can save you money!</p>
                        </div>
                    </div>

                    <div class="walkthrough-note">
                        <i class="fas fa-magic"></i>
                        <p>Don't worry about making this decision now! Our tool will ask you simple questions and automatically determine the best filing status for you.</p>
                    </div>

                    <script>
                        // Simple script to show the appropriate section when an option is clicked
                        document.querySelectorAll('.selector-option').forEach(option => {
                            option.addEventListener('click', function() {
                                const targetId = this.getAttribute('data-next');
                                document.querySelectorAll('.selector-result').forEach(result => {
                                    result.style.display = 'none';
                                });
                                document.getElementById(targetId).style.display = 'block';
                            });
                        });
                    </script>
                </div>
            `,
            resources: [
                { name: "Filing Status Explained Video", link: "#", description: "Watch our 2-minute video explaining filing statuses" },
                { name: "Head of Household Qualifier", link: "#", description: "Interactive tool to check if you qualify for Head of Household" },
                { name: "Married Filing Options", link: "#", description: "Detailed comparison of joint vs. separate filing" }
            ]
        },
        {
            title: "The Stimulus Money You Might Be Owed",
            content: `
                <div class="walkthrough-content">
                    <h3>Getting Your Missing Stimulus Money</h3>
                    <p>Let's talk about the money you might be owed from the government's COVID-19 stimulus program.</p>

                    <div class="story-explainer">
                        <div class="story-section">
                            <div class="story-icon"><i class="fas fa-virus"></i></div>
                            <div class="story-content">
                                <h4>What Happened</h4>
                                <p>During the COVID-19 pandemic, the government sent out money (called "stimulus payments") to help people financially.</p>
                                <p>The <strong>third and final payment</strong> of up to $1,400 per person was sent out in 2021.</p>
                            </div>
                        </div>

                        <div class="story-section">
                            <div class="story-icon"><i class="fas fa-money-bill-wave"></i></div>
                            <div class="story-content">
                                <h4>How Much Was It?</h4>
                                <div class="amount-box">
                                    <div class="amount-item">
                                        <div class="amount">$1,400</div>
                                        <div class="amount-label">for you</div>
                                    </div>
                                    <div class="amount-item">
                                        <div class="amount">$1,400</div>
                                        <div class="amount-label">for your spouse (if married)</div>
                                    </div>
                                    <div class="amount-item">
                                        <div class="amount">$1,400</div>
                                        <div class="amount-label">for each dependent</div>
                                    </div>
                                </div>
                                <div class="example-box">
                                    <span class="example-label">Example:</span> A family of 4 could receive up to $5,600 ($1,400 × 4)
                                </div>
                            </div>
                        </div>

                        <div class="story-section highlight">
                            <div class="story-icon"><i class="fas fa-exclamation-circle"></i></div>
                            <div class="story-content">
                                <h4>The Problem</h4>
                                <p>Many people never received this money or got less than they should have!</p>
                                <div class="common-scenarios">
                                    <div class="scenario">
                                        <i class="fas fa-times-circle"></i>
                                        <span>You never received any third stimulus payment</span>
                                    </div>
                                    <div class="scenario">
                                        <i class="fas fa-minus-circle"></i>
                                        <span>You received less than you should have</span>
                                    </div>
                                    <div class="scenario">
                                        <i class="fas fa-baby"></i>
                                        <span>You had a baby in 2021 (who wasn't included in your payment)</span>
                                    </div>
                                    <div class="scenario">
                                        <i class="fas fa-chart-line-down"></i>
                                        <span>Your income was lower in 2021 than in 2020 (making you eligible for more)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="story-section">
                            <div class="story-icon"><i class="fas fa-gift"></i></div>
                            <div class="story-content">
                                <h4>The Good News</h4>
                                <p>You can still claim this money now as the <strong>"Recovery Rebate Credit"</strong> on your 2021 tax return!</p>
                                <div class="good-news-highlight">
                                    <i class="fas fa-check-circle"></i>
                                    <span>This is free money you're entitled to - not a loan!</span>
                                </div>
                                <div class="good-news-highlight">
                                    <i class="fas fa-check-circle"></i>
                                    <span>You can claim it even if you don't normally file taxes</span>
                                </div>
                                <div class="good-news-highlight">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Our tool makes it super easy to claim</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="interactive-check">
                        <h4>Quick Check: Did You Get Your Full Stimulus?</h4>
                        <div class="check-questions">
                            <div class="check-question">
                                <p>Did you receive a third stimulus payment of $1,400 per person in your household in 2021?</p>
                                <div class="check-options">
                                    <div class="check-option" data-result="maybe-not">
                                        <i class="fas fa-times"></i>
                                        <span>No, I didn't</span>
                                    </div>
                                    <div class="check-option" data-result="maybe-partial">
                                        <i class="fas fa-question"></i>
                                        <span>I'm not sure</span>
                                    </div>
                                    <div class="check-option" data-result="maybe-yes">
                                        <i class="fas fa-check"></i>
                                        <span>Yes, I did</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="check-results">
                            <div class="check-result" id="maybe-not">
                                <div class="result-icon success"><i class="fas fa-dollar-sign"></i></div>
                                <div class="result-content">
                                    <h5>You're likely eligible for the full $1,400 per person!</h5>
                                    <p>Our calculator will help you claim this money on your tax return.</p>
                                </div>
                            </div>

                            <div class="check-result" id="maybe-partial">
                                <div class="result-icon success"><i class="fas fa-search-dollar"></i></div>
                                <div class="result-content">
                                    <h5>Let's find out if you're owed money!</h5>
                                    <p>Our tool will help you check if you received the payment and claim any amount you're still owed.</p>
                                </div>
                            </div>

                            <div class="check-result" id="maybe-yes">
                                <div class="result-icon"><i class="fas fa-info-circle"></i></div>
                                <div class="result-content">
                                    <h5>You might still be eligible for more!</h5>
                                    <p>If your family situation changed in 2021 (new baby, lower income, etc.), you might still be owed additional stimulus money.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="walkthrough-note highlight">
                        <i class="fas fa-magic"></i>
                        <div>
                            <p><strong>Don't worry about figuring this out on your own!</strong></p>
                            <p>Our calculator will automatically determine if you're owed stimulus money and exactly how much to claim on your tax return.</p>
                        </div>
                    </div>

                    <script>
                        // Simple script to show the appropriate result when an option is clicked
                        document.querySelectorAll('.check-option').forEach(option => {
                            option.addEventListener('click', function() {
                                const resultId = this.getAttribute('data-result');
                                document.querySelectorAll('.check-result').forEach(result => {
                                    result.style.display = 'none';
                                });
                                document.getElementById(resultId).style.display = 'flex';
                            });
                        });
                    </script>
                </div>
            `,
            resources: [
                { name: "Stimulus Payment Explainer Video", link: "#", description: "Watch our 2-minute video explaining the stimulus payment" },
                { name: "Stimulus Payment Tracker", link: "#", description: "Tool to help determine if you received the third stimulus payment" },
                { name: "Recovery Rebate Credit FAQ", link: "#", description: "Simple answers to common questions about claiming your stimulus money" }
            ]
        },
        {
            title: "How We'll Fill Out Your Tax Forms",
            content: `
                <div class="walkthrough-content">
                    <h3>Don't Worry - We'll Handle the Forms!</h3>
                    <p>Tax forms can be confusing, but our tool will fill them out for you. Here's a simple explanation of what we'll be doing:</p>

                    <div class="form-explainer">
                        <div class="form-explainer-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>The Main Tax Form: Form 1040</h4>
                                <div class="form-visual">
                                    <img src="./static/images/form-1040-simplified.jpg" alt="Simplified Form 1040" class="form-image">
                                    <div class="form-highlight" style="top: 65%; left: 70%; width: 25%; height: 5%;">
                                        <span class="highlight-label">Line 30: Recovery Rebate Credit</span>
                                    </div>
                                </div>
                                <div class="form-explanation">
                                    <p>This is the main tax form that everyone files. Think of it as the "summary page" of your tax return.</p>
                                    <p>The <strong>Recovery Rebate Credit</strong> (your stimulus money) goes on <strong>Line 30</strong> of this form.</p>
                                    <div class="beginner-note">
                                        <i class="fas fa-lightbulb"></i>
                                        <p>Our calculator will figure out exactly what number to put on Line 30!</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-explainer-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Supporting Forms (Only If You Need Them)</h4>
                                <div class="supporting-forms">
                                    <div class="supporting-form">
                                        <div class="form-icon"><i class="fas fa-file-alt"></i></div>
                                        <div class="form-details">
                                            <h5>Schedule 1</h5>
                                            <p>For reporting additional income (like self-employment or unemployment)</p>
                                        </div>
                                    </div>

                                    <div class="supporting-form">
                                        <div class="form-icon"><i class="fas fa-file-alt"></i></div>
                                        <div class="form-details">
                                            <h5>Schedule 2</h5>
                                            <p>For reporting additional taxes</p>
                                        </div>
                                    </div>

                                    <div class="supporting-form">
                                        <div class="form-icon"><i class="fas fa-file-alt"></i></div>
                                        <div class="form-details">
                                            <h5>Schedule 3</h5>
                                            <p>For claiming additional credits</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="beginner-note highlight">
                                    <i class="fas fa-magic"></i>
                                    <p>Our tool will automatically determine which forms you need based on your situation - you don't need to figure this out!</p>
                                </div>
                            </div>
                        </div>

                        <div class="form-explainer-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>How Our Tool Makes This Easy</h4>
                                <div class="easy-steps">
                                    <div class="easy-step">
                                        <div class="easy-step-icon"><i class="fas fa-question-circle"></i></div>
                                        <div class="easy-step-text">We ask you simple questions in plain English</div>
                                    </div>
                                    <div class="easy-step">
                                        <div class="easy-step-icon"><i class="fas fa-calculator"></i></div>
                                        <div class="easy-step-text">Our system does all the calculations automatically</div>
                                    </div>
                                    <div class="easy-step">
                                        <div class="easy-step-icon"><i class="fas fa-file-signature"></i></div>
                                        <div class="easy-step-text">We fill out all the right forms with the correct information</div>
                                    </div>
                                    <div class="easy-step">
                                        <div class="easy-step-icon"><i class="fas fa-check-circle"></i></div>
                                        <div class="easy-step-text">You review everything before submitting</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="walkthrough-note highlight">
                        <i class="fas fa-heart"></i>
                        <div>
                            <p><strong>You don't need to understand tax forms to use our tool!</strong></p>
                            <p>We've designed our system to handle all the complicated parts for you. Just answer our simple questions, and we'll take care of the rest.</p>
                        </div>
                    </div>
                </div>
            `,
            resources: [
                { name: "Tax Forms Explained Video", link: "#", description: "Watch our 2-minute video explaining tax forms in simple terms" },
                { name: "Form 1040 Preview", link: "#", description: "See what Form 1040 looks like (with helpful annotations)" },
                { name: "Recovery Rebate Credit Explainer", link: "#", description: "Simple explanation of how the Recovery Rebate Credit works" }
            ]
        },
        {
            title: "Sending Your Tax Return",
            content: `
                <div class="walkthrough-content">
                    <h3>The Final Step: Getting Your Return to the IRS</h3>
                    <p>After we help you prepare your tax return, you'll need to send it to the IRS. We'll make this super easy!</p>

                    <div class="mailing-explainer">
                        <div class="mailing-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Print Your Completed Return</h4>
                                <div class="print-instructions">
                                    <div class="instruction-icon"><i class="fas fa-print"></i></div>
                                    <div class="instruction-text">
                                        <p>Our tool will create a complete, ready-to-print tax return with all the right forms filled out.</p>
                                        <div class="print-checklist">
                                            <div class="checklist-item">
                                                <i class="fas fa-check-circle"></i>
                                                <span>Form 1040 (the main tax form)</span>
                                            </div>
                                            <div class="checklist-item">
                                                <i class="fas fa-check-circle"></i>
                                                <span>Any required schedules</span>
                                            </div>
                                            <div class="checklist-item">
                                                <i class="fas fa-check-circle"></i>
                                                <span>Recovery Rebate Credit worksheet</span>
                                            </div>
                                        </div>
                                        <div class="beginner-note">
                                            <i class="fas fa-lightbulb"></i>
                                            <p>Don't have a printer? No problem! We'll show you options like printing at a library or office supply store.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mailing-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Sign Your Return</h4>
                                <div class="signature-instructions">
                                    <div class="instruction-icon"><i class="fas fa-signature"></i></div>
                                    <div class="instruction-text">
                                        <p>You <strong>must</strong> sign and date your tax return for it to be valid.</p>
                                        <div class="signature-example">
                                            <img src="./static/images/signature-example.jpg" alt="Signature Example" class="signature-image">
                                            <div class="signature-highlight">
                                                <span class="highlight-label">Sign here with blue or black ink</span>
                                            </div>
                                        </div>
                                        <div class="beginner-note">
                                            <i class="fas fa-exclamation-circle"></i>
                                            <p>This is one of the most commonly forgotten steps! We'll remind you exactly where to sign.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mailing-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Mail Your Return</h4>
                                <div class="mail-instructions">
                                    <div class="instruction-icon"><i class="fas fa-envelope"></i></div>
                                    <div class="instruction-text">
                                        <p>For 2021 tax returns, you'll need to mail a paper return to the IRS.</p>
                                        <div class="mailing-details">
                                            <div class="detail-item">
                                                <div class="detail-label">Where to mail:</div>
                                                <div class="detail-value">We'll provide the exact mailing address based on your state</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">What to include:</div>
                                                <div class="detail-value">All printed and signed forms (stapled in the upper left corner)</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Envelope type:</div>
                                                <div class="detail-value">Any standard envelope that fits your documents</div>
                                            </div>
                                        </div>
                                        <div class="beginner-note highlight">
                                            <i class="fas fa-star"></i>
                                            <p><strong>Pro tip:</strong> Use certified mail with a return receipt so you have proof that you sent your return and the IRS received it.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mailing-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Track Your Refund</h4>
                                <div class="tracking-instructions">
                                    <div class="instruction-icon"><i class="fas fa-search-dollar"></i></div>
                                    <div class="instruction-text">
                                        <p>After mailing your return, you can check your refund status.</p>
                                        <div class="tracking-options">
                                            <div class="tracking-option">
                                                <i class="fas fa-globe"></i>
                                                <span>Use the "Where's My Refund?" tool on IRS.gov</span>
                                            </div>
                                            <div class="tracking-option">
                                                <i class="fas fa-mobile-alt"></i>
                                                <span>Use the IRS2Go mobile app</span>
                                            </div>
                                            <div class="tracking-option">
                                                <i class="fas fa-phone"></i>
                                                <span>Call the IRS refund hotline</span>
                                            </div>
                                        </div>
                                        <div class="beginner-note">
                                            <i class="fas fa-clock"></i>
                                            <p>Paper returns take longer to process - typically 6-8 weeks before your refund is issued.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="walkthrough-note highlight">
                        <i class="fas fa-heart"></i>
                        <div>
                            <p><strong>We'll guide you through each of these steps!</strong></p>
                            <p>Our tool provides detailed, personalized instructions for mailing your return, including the exact address to use and a printable checklist to make sure you don't miss anything.</p>
                        </div>
                    </div>
                </div>
            `,
            resources: [
                { name: "Mailing Your Return Video", link: "#", description: "Watch our 2-minute video showing exactly how to mail your return" },
                { name: "Printable Mailing Checklist", link: "#", description: "Download our checklist to make sure you don't forget anything" },
                { name: "Where's My Refund? Guide", link: "#", description: "Step-by-step guide to checking your refund status" }
            ]
        },
        {
            title: "After You File",
            content: `
                <div class="walkthrough-content">
                    <h3>What Happens After You File</h3>
                    <p>After submitting your 2021 tax return, here's what to expect:</p>

                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-marker">1</div>
                            <div class="timeline-content">
                                <h4>Processing Time</h4>
                                <p><strong>Paper returns:</strong> 6-8 weeks minimum (often longer for prior year returns)</p>
                                <p><strong>E-filed returns:</strong> 3-4 weeks</p>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-marker">2</div>
                            <div class="timeline-content">
                                <h4>Tracking Your Return</h4>
                                <p>You can check your refund status using the IRS "Where's My Refund?" tool:</p>
                                <ul>
                                    <li>For paper returns: Allow 4 weeks before checking status</li>
                                    <li>For e-filed returns: Allow 24 hours before checking status</li>
                                </ul>
                                <p>You'll need your:</p>
                                <ul>
                                    <li>Social Security Number</li>
                                    <li>Filing Status</li>
                                    <li>Exact refund amount</li>
                                </ul>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-marker">3</div>
                            <div class="timeline-content">
                                <h4>Receiving Your Refund</h4>
                                <p>If you're due a refund, you'll receive it via:</p>
                                <ul>
                                    <li><strong>Direct deposit:</strong> Fastest method, typically 1-2 weeks after return is processed</li>
                                    <li><strong>Paper check:</strong> May take additional 1-2 weeks after processing</li>
                                </ul>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-marker">4</div>
                            <div class="timeline-content">
                                <h4>Possible IRS Contact</h4>
                                <p>The IRS may contact you if:</p>
                                <ul>
                                    <li>There are discrepancies in your return</li>
                                    <li>Additional information is needed</li>
                                    <li>Your return is selected for review</li>
                                </ul>
                                <p><strong>Important:</strong> The IRS will always contact you by mail first, never by email, text, or phone call.</p>
                            </div>
                        </div>
                    </div>

                    <div class="walkthrough-note">
                        <i class="fas fa-lightbulb"></i>
                        <p>Keep your tax return confirmation number and a complete copy of your return for your records.</p>
                    </div>
                </div>
            `,
            resources: [
                { name: "IRS Where's My Refund Tool", link: "#", description: "Official IRS tool to check refund status" },
                { name: "What to Do If Your Refund Is Delayed", link: "#", description: "Steps to take if your refund takes longer than expected" }
            ]
        }
    ];

    // Public methods
    return {
        // Initialize the walkthrough
        init: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Walkthrough container with ID '${containerId}' not found.`);
                return false;
            }

            try {
                // Create walkthrough UI
                this.renderWalkthrough(container);
                this.showStep(0);

                // Add event listeners
                const nextButton = document.getElementById('walkthrough-next');
                const prevButton = document.getElementById('walkthrough-prev');

                if (nextButton) {
                    nextButton.addEventListener('click', () => this.nextStep());
                } else {
                    console.warn('Walkthrough next button not found.');
                }

                if (prevButton) {
                    prevButton.addEventListener('click', () => this.prevStep());
                } else {
                    console.warn('Walkthrough previous button not found.');
                }

                // Add progress indicator listeners
                document.querySelectorAll('.walkthrough-progress-step').forEach((step, index) => {
                    step.addEventListener('click', () => this.showStep(index));
                });

                // Show beginner intro for first-time users
                this.showBeginnerIntro();

                return true;
            } catch (error) {
                console.error('Error initializing walkthrough:', error);
                return false;
            }
        },

        // Show a special intro for absolute beginners
        showBeginnerIntro: function() {
            // Check if we've shown this before
            if (localStorage.getItem('taxFilingMode')) return;

            const introModal = document.createElement('div');
            introModal.className = 'beginner-intro-modal';
            introModal.innerHTML = `
                <div class="beginner-intro-content">
                    <div class="beginner-intro-header">
                        <i class="fas fa-hand-holding-usd"></i>
                        <h2>Welcome to Your Tax Filing Journey!</h2>
                    </div>
                    <p>We notice this might be your first time filing taxes or claiming a Recovery Rebate Credit.</p>
                    <p><strong>Don't worry!</strong> We've designed this tool specifically for beginners like you.</p>

                    <div class="beginner-intro-features">
                        <div class="intro-feature">
                            <i class="fas fa-baby"></i>
                            <div>
                                <h3>Beginner-Friendly</h3>
                                <p>We explain everything in simple, everyday language with no tax jargon.</p>
                            </div>
                        </div>

                        <div class="intro-feature">
                            <i class="fas fa-hand-holding-heart"></i>
                            <div>
                                <h3>Step-by-Step Guidance</h3>
                                <p>We'll walk you through each tiny step of the process with clear instructions.</p>
                            </div>
                        </div>

                        <div class="intro-feature">
                            <i class="fas fa-robot"></i>
                            <div>
                                <h3>Smart Assistance</h3>
                                <p>Our AI helper can answer any questions you have along the way.</p>
                            </div>
                        </div>
                    </div>

                    <div class="beginner-intro-options">
                        <button class="btn btn-primary" id="beginnerModeBtn">I'm New to This - Help Me!</button>
                        <button class="btn btn-secondary" id="experiencedModeBtn">I've Filed Taxes Before</button>
                    </div>
                </div>
            `;

            document.body.appendChild(introModal);

            // Add event listeners
            document.getElementById('beginnerModeBtn').addEventListener('click', () => {
                localStorage.setItem('taxFilingMode', 'beginner');
                introModal.classList.add('fade-out');
                setTimeout(() => {
                    introModal.remove();
                    this.showBeginnerTip('Welcome to beginner mode! We'll explain everything in extra detail.');
                }, 300);
            });

            document.getElementById('experiencedModeBtn').addEventListener('click', () => {
                localStorage.setItem('taxFilingMode', 'experienced');
                introModal.classList.add('fade-out');
                setTimeout(() => {
                    introModal.remove();
                }, 300);
            });
        },

        // Show beginner tips throughout the process
        showBeginnerTip: function(message) {
            const tipElement = document.createElement('div');
            tipElement.className = 'beginner-tip';
            tipElement.innerHTML = `
                <div class="beginner-tip-content">
                    <i class="fas fa-lightbulb"></i>
                    <p>${message}</p>
                    <button class="beginner-tip-close"><i class="fas fa-times"></i></button>
                </div>
            `;

            document.body.appendChild(tipElement);

            // Add animation
            setTimeout(() => {
                tipElement.classList.add('show');
            }, 100);

            // Add event listener to close button
            tipElement.querySelector('.beginner-tip-close').addEventListener('click', function() {
                tipElement.classList.remove('show');
                setTimeout(() => {
                    tipElement.remove();
                }, 300);
            });

            // Auto-hide after 8 seconds
            setTimeout(() => {
                if (document.body.contains(tipElement)) {
                    tipElement.classList.remove('show');
                    setTimeout(() => {
                        if (document.body.contains(tipElement)) {
                            tipElement.remove();
                        }
                    }, 300);
                }
            }, 8000);
        },

        // Render the walkthrough UI
        renderWalkthrough: function(container) {
            // Create walkthrough container
            const walkthroughHTML = `
                <div class="walkthrough-container">
                    <div class="walkthrough-progress">
                        ${steps.map((step, index) => `
                            <div class="walkthrough-progress-step" data-step="${index}">
                                <div class="progress-step-number">${index + 1}</div>
                                <div class="progress-step-title">${step.title}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="walkthrough-content-container">
                        <div class="walkthrough-header">
                            <h2 id="walkthrough-title"></h2>
                            <div class="walkthrough-step-indicator">
                                Step <span id="current-step">1</span> of ${totalSteps}
                            </div>
                        </div>

                        <div id="walkthrough-content" class="walkthrough-main-content"></div>

                        <div class="walkthrough-resources">
                            <h4><i class="fas fa-book"></i> Helpful Resources</h4>
                            <div id="walkthrough-resources-list" class="resources-list"></div>
                        </div>

                        <div class="walkthrough-navigation">
                            <button id="walkthrough-prev" class="btn btn-secondary">
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                            <button id="walkthrough-next" class="btn btn-accent">
                                Next <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML = walkthroughHTML;
        },

        // Show a specific step
        showStep: function(stepIndex) {
            try {
                if (stepIndex < 0 || stepIndex >= totalSteps) {
                    console.warn(`Invalid step index: ${stepIndex}. Must be between 0 and ${totalSteps - 1}.`);
                    return false;
                }

                currentStep = stepIndex;
                const step = steps[stepIndex];

                // Update content
                const titleElement = document.getElementById('walkthrough-title');
                const currentStepElement = document.getElementById('current-step');
                const contentElement = document.getElementById('walkthrough-content');
                const resourcesList = document.getElementById('walkthrough-resources-list');
                const prevButton = document.getElementById('walkthrough-prev');
                const nextButton = document.getElementById('walkthrough-next');

                // Check if all required elements exist
                if (!titleElement || !currentStepElement || !contentElement || !resourcesList || !prevButton || !nextButton) {
                    console.error('One or more required walkthrough elements not found.');
                    return false;
                }

                // Update content
                titleElement.textContent = step.title;
                currentStepElement.textContent = stepIndex + 1;
                contentElement.innerHTML = step.content;

                // Update resources
                if (step.resources && Array.isArray(step.resources)) {
                    resourcesList.innerHTML = step.resources.map(resource => `
                        <div class="resource-item">
                            <h5 class="resource-title">
                                <i class="fas fa-file-alt"></i> ${resource.name}
                            </h5>
                            <p>${resource.description}</p>
                            <a href="${resource.link}" class="download-btn" target="_blank">
                                <i class="fas fa-download"></i> Access Resource
                            </a>
                        </div>
                    `).join('');
                } else {
                    resourcesList.innerHTML = '<div class="no-resources">No additional resources for this step.</div>';
                }

                // Update navigation buttons
                prevButton.disabled = stepIndex === 0;
                nextButton.textContent = stepIndex === totalSteps - 1 ? 'Start Filing' : 'Next';
                nextButton.innerHTML = stepIndex === totalSteps - 1 ?
                    'Start Filing <i class="fas fa-check"></i>' :
                    'Next <i class="fas fa-arrow-right"></i>';

                // Update progress indicators
                document.querySelectorAll('.walkthrough-progress-step').forEach((el, index) => {
                    el.classList.remove('active', 'completed');
                    if (index === stepIndex) {
                        el.classList.add('active');
                    } else if (index < stepIndex) {
                        el.classList.add('completed');
                    }
                });

                // Add event listeners to form preview links
                document.querySelectorAll('.form-preview-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const formId = link.getAttribute('data-form');
                        this.showFormPreview(formId);
                    });
                });

                return true;
            } catch (error) {
                console.error('Error showing walkthrough step:', error);
                return false;
            }
        },

        // Navigate to next step
        nextStep: function() {
            try {
                if (currentStep < totalSteps - 1) {
                    return this.showStep(currentStep + 1);
                } else {
                    // Start the actual filing process
                    const filingTool = document.querySelector('.filing-tool');
                    const walkthroughContainer = document.querySelector('.walkthrough-container');
                    const filingStep1 = document.getElementById('filingStep1');

                    if (!filingTool || !walkthroughContainer || !filingStep1) {
                        console.error('Required filing tool elements not found.');
                        return false;
                    }

                    filingTool.style.display = 'block';
                    walkthroughContainer.style.display = 'none';
                    filingStep1.classList.add('active');
                    return true;
                }
            } catch (error) {
                console.error('Error navigating to next step:', error);
                return false;
            }
        },

        // Navigate to previous step
        prevStep: function() {
            try {
                if (currentStep > 0) {
                    return this.showStep(currentStep - 1);
                }
                return true; // No action needed but not an error
            } catch (error) {
                console.error('Error navigating to previous step:', error);
                return false;
            }
        },

        // Show tax form preview
        showFormPreview: function(formId) {
            try {
                if (!formId) {
                    console.error('Invalid form ID provided to showFormPreview');
                    return false;
                }

                // Create modal for form preview
                const modal = document.createElement('div');
                modal.className = 'form-preview-modal';

                // Safely determine form title
                let formTitle = '';
                try {
                    formTitle = formId === '1040' ? 'Form 1040' : 'Schedule ' + formId.replace('schedule', '');
                } catch (e) {
                    formTitle = `Form ${formId}`; // Fallback title
                }

                modal.innerHTML = `
                    <div class="form-preview-content">
                        <div class="form-preview-header">
                            <h3>2021 ${formTitle}</h3>
                            <button class="form-preview-close"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="form-preview-body">
                            <iframe src="./static/forms/${formId.toLowerCase()}_2021.pdf" width="100%" height="500px"></iframe>
                        </div>
                        <div class="form-preview-footer">
                            <a href="./static/forms/${formId.toLowerCase()}_2021.pdf" download class="btn btn-primary">
                                <i class="fas fa-download"></i> Download Form
                            </a>
                            <button class="btn btn-secondary form-preview-close">Close</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                // Add event listeners
                const closeButtons = modal.querySelectorAll('.form-preview-close');
                if (closeButtons && closeButtons.length > 0) {
                    closeButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            if (document.body.contains(modal)) {
                                document.body.removeChild(modal);
                            }
                        });
                    });
                }

                // Close on click outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal && document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                });

                return true;
            } catch (error) {
                console.error('Error showing form preview:', error);
                return false;
            }
        }
    };
})();

// Export the module
export default TaxWalkthrough;
