import { generatePDF } from './reportGenerator';

interface EmailContact {
  name: string;
  email: string;
}

interface EmailData {
  customerName: string;
  repairs: any[];
  contact: EmailContact;
}

export const sendOutlookEmail = async (data: EmailData): Promise<void> => {
  try {
    // Generate PDF for attachment
    const pdfBlob = await generatePDF(data);
    
    // Format repair status summary
    const statusSummary = data.repairs
      .map(repair => `${repair.serviceOrder}: ${repair.productStatus}`)
      .join('\n');

    // Create email body
    const emailBody = `
Dear ${data.contact.name},

I am writing to provide you with this week's update on your open repairs with Cosworth. Below, you will find a table that outlines the current status of each of your repairs. The table includes detailed information such as sales order, service order, product status, and estimated completion date.

This Week's Update:
${statusSummary}

We Value Your Feedback:
Your feedback is very important to Cosworth. Please let me know if you have any questions, concerns, or suggestions regarding our repair services or this update. You can reply to this email directly, or contact me using the details below.

Contact Us:
For more details about your repairs, feel free to contact me directly or use the RMA tracker on our website for the latest updates.

Kind regards,
Will
    `;

    // Create Outlook mail item
    const outlookApp = new ActiveXObject('Outlook.Application');
    const mailItem = outlookApp.CreateItem(0); // 0 = olMailItem

    // Set email properties
    mailItem.To = data.contact.email;
    mailItem.Subject = `Cosworth Repair Status Update - ${new Date().toLocaleDateString()}`;
    mailItem.Body = emailBody;
    
    // Attach the PDF
    mailItem.Attachments.Add(pdfBlob);

    // Display the email for review before sending
    mailItem.Display();

    return Promise.resolve();
  } catch (error) {
    console.error('Error creating Outlook email:', error);
    throw error;
  }
};