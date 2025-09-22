export const adminOnboardingMail = (
  name: string,
  link: string,
  currentYear: string
) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Your Onboarding - TenaClass</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #e6e8f0; color: black;">
    
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header with logo -->
        <div style="width: 2.5rem; height: 2.5rem; margin: 30px auto; border: 1px solid black; background-color: #ff6536; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 1.25rem;">T</span>
        </div>

        <!-- Main content -->
        <div style="padding: 0 40px 40px 40px; text-align: center;">
            
            <h1 style="color: black; font-size: 28px; font-weight: 600; margin: 0 0 30px 0; line-height: 1.3;">
                Let's Complete Your Onboarding
            </h1>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                Hi ${name} ,
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                You're just one step away from unlocking the full TenaClass experience!
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
               To help you set up your school, manage courses, and oversee your educational platform, we need you to complete your onboarding process.
            </p>

            <!-- Time notice -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid black; margin: 0 0 30px 0; text-align: left;">
                <p style="color: black; font-size: 14px; margin: 0; line-height: 1.4;">
                    <strong>Note:</strong> Your onboarding link will expire in 
                    <span style="color: #ff6536; font-size: 18px; font-weight: bold;">1 hour</span>. 
                    Don't miss out!
                </p>
            </div>

            <!-- CTA Button -->
            <div style="margin: 0 0 30px 0;">
                <a href=${link} style="display: inline-block; background-color: #ff6536; color: white; border: 2px solid black; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 8px; transition: background-color 0.3s ease;">
                    Complete Onboarding
                </a>
            </div>

            <p style="color: black; font-size: 14px; line-height: 1.5; margin: 0 0 30px 0;">
                If you have any questions or need help, our customer support team is just a message away.
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;">
                See you inside!
            </p>

            <!-- Company signature -->
            <div style="text-align: left; margin-top: 20px;">
                <p style="color: black; font-weight: 600; font-size: 16px; margin: 0 0 5px 0;">
                    TenaClass
                </p>
                <p style="color: black; font-size: 14px; margin: 0;">
                    Your secure educational management system!
                </p>
            </div>

        </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding: 0 20px;">
        <p style="color: #999; font-size: 12px; margin: 0;">
            © ${currentYear} TenaClass. All rights reserved.
        </p>
    </div>

</body>
</html>
    `;
};

export const adminUnOnboardingDeleteMail = (
  name: string,
  signupLink: string,
  currentYear: string
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deleted - TenaClass</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #e6e8f0; color: black;">
    
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header with logo -->
        <div style="width: 2.5rem; height: 2.5rem; margin: 30px auto; border: 1px solid black; background-color: #ff6536; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 1.25rem;">T</span>
        </div>

        <!-- Main content -->
        <div style="padding: 0 40px 40px 40px; text-align: center;">
            
            <h1 style="color: #dc3545; font-size: 28px; font-weight: 600; margin: 0 0 30px 0; line-height: 1.3;">
                Your Account Has Been Deleted
            </h1>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                Hi ${name},
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                We're writing to inform you that your TenaClass account has been automatically deleted.
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                This occurred because it has been three days since you created your account and you haven't completed the onboarding process for your school.
            </p>

            <!-- Notice box -->
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 0 0 30px 0; text-align: left;">
                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.4;">
                    <strong>Account Deletion Policy:</strong> To maintain system security and organization, accounts that remain incomplete for more than 
                    <span style="color: #dc3545; font-weight: bold;">72 hours</span> 
                    are automatically removed from our system.
                </p>
            </div>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                <strong>Want to rejoin TenaClass?</strong>
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                You can create a new account anytime and complete the onboarding process to access all TenaClass features.
            </p>

            <!-- CTA Button -->
            <div style="margin: 0 0 30px 0;">
                <a href="${signupLink}" style="display: inline-block; background-color: #ff6536; color: white; border: 2px solid black; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 8px; transition: background-color 0.3s ease;">
                    Create New Account
                </a>
            </div>

            <p style="color: black; font-size: 14px; line-height: 1.5; margin: 0 0 30px 0;">
                If you have any questions or need assistance with creating a new account, our customer support team is here to help.
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;">
                Thank you for your interest in TenaClass.
            </p>

            <!-- Company signature -->
            <div style="text-align: left; margin-top: 20px;">
                <p style="color: black; font-weight: 600; font-size: 16px; margin: 0 0 5px 0;">
                    TenaClass
                </p>
                <p style="color: black; font-size: 14px; margin: 0;">
                    Your secure educational management system!
                </p>
            </div>

        </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding: 0 20px;">
        <p style="color: #999; font-size: 12px; margin: 0;">
            © ${currentYear} TenaClass. All rights reserved.
        </p>
    </div>

</body>
</html>`;
};

export const studentCreationMail = (
  name: string,
  email: string,
  password: string,
  link: string,
  currentYear: string
) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your TenaClass Login Credentials</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #e6e8f0; color: black;">
    
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header with logo -->
        <div style="width: 2.5rem; height: 2.5rem; margin: 30px auto; border: 1px solid black; background-color: #ff6536; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 1.25rem;">T</span>
        </div>

        <!-- Main content -->
        <div style="padding: 0 40px 40px 40px; text-align: center;">
            
            <h1 style="color: black; font-size: 28px; font-weight: 600; margin: 0 0 30px 0; line-height: 1.3;">
                Welcome to TenaClass!
            </h1>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                Hi ${name},
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                Your account has been created successfully! You can now access your courses and learning materials.
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
               Below are your login credentials to access the TenaClass Learning Management System.
            </p>

            <!-- Login Credentials -->
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid black; margin: 0 0 30px 0; text-align: left;">
                <h3 style="color: black; font-size: 18px; margin: 0 0 20px 0; text-align: center;">Your Login Credentials</h3>
                
                <div style="margin: 0 0 15px 0;">
                    <strong style="color: black; font-size: 14px; display: block; margin-bottom: 5px;">Email Address:</strong>
                    <span style="color: #ff6536; font-size: 16px; font-weight: bold; background-color: white; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; display: inline-block; font-family: 'Courier New', monospace;">${email}</span>
                </div>
                
                <div style="margin: 0 0 15px 0;">
                    <strong style="color: black; font-size: 14px; display: block; margin-bottom: 5px;">Temporary Password:</strong>
                    <span style="color: #ff6536; font-size: 16px; font-weight: bold; background-color: white; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; display: inline-block; font-family: 'Courier New', monospace;">${password}</span>
                </div>

                <p style="color: #666; font-size: 12px; margin: 15px 0 0 0; font-style: italic;">
                    <strong>Important:</strong> Please change your password after your first login for security reasons.
                </p>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 0 0 30px 0; text-align: left;">
                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.4;">
                    <strong>Security Reminder:</strong> Keep your login credentials secure and never share them with others. 
                    If you suspect your account has been compromised, contact support immediately.
                </p>
            </div>

            <!-- CTA Button -->
            <div style="margin: 0 0 30px 0;">
                <a href="${link}" style="display: inline-block; background-color: #ff6536; color: white; border: 2px solid black; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 8px; transition: background-color 0.3s ease;">
                    Login to TenaClass
                </a>
            </div>

            <p style="color: black; font-size: 14px; line-height: 1.5; margin: 0 0 30px 0;">
                If you have any questions or need help logging in, our customer support team is ready to assist you.
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;">
                Happy learning!
            </p>

            <!-- Company signature -->
            <div style="text-align: left; margin-top: 20px;">
                <p style="color: black; font-weight: 600; font-size: 16px; margin: 0 0 5px 0;">
                    TenaClass Support Team
                </p>
                <p style="color: black; font-size: 14px; margin: 0;">
                    Your secure educational management system!
                </p>
            </div>

        </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding: 0 20px;">
        <p style="color: #999; font-size: 12px; margin: 0;">
            © ${currentYear} TenaClass. All rights reserved.
        </p>
        <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
            For support, contact us at support@tenaclass.com
        </p>
    </div>

</body>
</html>
    `;
};

export const teacherCreationMail = (
  name: string,
  email: string,
  password: string,
  link: string,
  currentYear: string
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your TenaClass Teacher Account Credentials</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #e6e8f0; color: black;">
    
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header with logo -->
        <div style="width: 2.5rem; height: 2.5rem; margin: 30px auto; border: 1px solid black; background-color: #ff6536; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 1.25rem;">T</span>
        </div>

        <!-- Main content -->
        <div style="padding: 0 40px 40px 40px; text-align: center;">
            
            <h1 style="color: black; font-size: 28px; font-weight: 600; margin: 0 0 30px 0; line-height: 1.3;">
                Welcome to TenaClass, Educator!
            </h1>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                Hi ${name},
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                Your teacher account has been created successfully! You now have access to create and manage courses, track student progress, and utilize all our educator tools.
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
               Below are your login credentials to access the TenaClass Teaching Dashboard and Learning Management System.
            </p>

            <!-- Login Credentials -->
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid black; margin: 0 0 30px 0; text-align: left;">
                <h3 style="color: black; font-size: 18px; margin: 0 0 20px 0; text-align: center;">Your Teacher Login Credentials</h3>
                
                <div style="margin: 0 0 15px 0;">
                    <strong style="color: black; font-size: 14px; display: block; margin-bottom: 5px;">Email Address:</strong>
                    <span style="color: #ff6536; font-size: 16px; font-weight: bold; background-color: white; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; display: inline-block; font-family: 'Courier New', monospace;">${email}</span>
                </div>
                
                <div style="margin: 0 0 15px 0;">
                    <strong style="color: black; font-size: 14px; display: block; margin-bottom: 5px;">Temporary Password:</strong>
                    <span style="color: #ff6536; font-size: 16px; font-weight: bold; background-color: white; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; display: inline-block; font-family: 'Courier New', monospace;">${password}</span>
                </div>

                <div style="margin: 0 0 15px 0;">
                    <strong style="color: black; font-size: 14px; display: block; margin-bottom: 5px;">Account Type:</strong>
                    <span style="color: #28a745; font-size: 16px; font-weight: bold; background-color: white; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; display: inline-block;">Teacher/Educator</span>
                </div>

                <p style="color: #666; font-size: 12px; margin: 15px 0 0 0; font-style: italic;">
                    <strong>Important:</strong> Please change your password after your first login for security reasons.
                </p>
            </div>

            <!-- Teacher Features Notice -->
            <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; border: 1px solid #b3d9ff; margin: 0 0 30px 0; text-align: left;">
                <h4 style="color: #0056b3; font-size: 16px; margin: 0 0 10px 0;">Teacher Dashboard Features:</h4>
                <ul style="color: #0056b3; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.4;">
                    <li>Create and manage courses and assignments</li>
                    <li>Track student progress and grades</li>
                    <li>Access teaching resources and materials</li>
                    <li>Communicate with students and parents</li>
                    <li>Generate reports and analytics</li>
                </ul>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 0 0 30px 0; text-align: left;">
                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.4;">
                    <strong>Security Reminder:</strong> Keep your login credentials secure and never share them with others. 
                    As an educator, you have access to sensitive student information. If you suspect your account has been compromised, contact support immediately.
                </p>
            </div>

            <!-- CTA Button -->
            <div style="margin: 0 0 30px 0;">
                <a href="${link}" style="display: inline-block; background-color: #ff6536; color: white; border: 2px solid black; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 8px; transition: background-color 0.3s ease;">
                    Access Teacher Dashboard
                </a>
            </div>

            <p style="color: black; font-size: 14px; line-height: 1.5; margin: 0 0 30px 0;">
                If you have any questions or need help with the platform, our dedicated educator support team is ready to assist you. We also offer training sessions and resources to help you get the most out of TenaClass.
            </p>

            <p style="color: black; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;">
                Happy teaching!
            </p>

            <!-- Company signature -->
            <div style="text-align: left; margin-top: 20px;">
                <p style="color: black; font-weight: 600; font-size: 16px; margin: 0 0 5px 0;">
                    TenaClass Educator Support Team
                </p>
                <p style="color: black; font-size: 14px; margin: 0;">
                    Empowering educators with secure educational management!
                </p>
            </div>

        </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding: 0 20px;">
        <p style="color: #999; font-size: 12px; margin: 0;">
            © ${currentYear} TenaClass. All rights reserved.
        </p>
        <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
            For educator support, contact us at teachers@tenaclass.com | General support: support@tenaclass.com
        </p>
    </div>

</body>
</html>
    `;
};
