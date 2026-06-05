import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface UpcomingInvoiceEmailProps {
  parentName: string;
  amountDue: string;
  renewalDate: string;
  dashboardUrl: string;
}

export default function UpcomingInvoiceEmail({
  parentName = "Parent",
  amountDue = "150.00",
  renewalDate = "June 15, 2026",
  dashboardUrl = "https://musicschool-platform.vercel.app/parent/dashboard",
}: UpcomingInvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your upcoming monthly investment for Apollo Academy</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>Apollo Performing Arts & Academy</Text>
          <Hr style={hr} />
          
          <Text style={paragraph}>Hello {parentName},</Text>
          <Text style={paragraph}>
            This is a friendly reminder that your upcoming monthly investment of <strong>${amountDue}</strong> will automatically process on <strong>{renewalDate}</strong>.
          </Text>
          <Text style={paragraph}>
            This investment secures your child's service credits for the upcoming cycle, ensuring they maintain uninterrupted access to their masterclasses and instructors.
          </Text>
          
          <Section style={btnContainer}>
            <Button style={button} href={dashboardUrl}>
              Manage Account & View Credits
            </Button>
          </Section>
          
          <Text style={paragraph}>
            If you need to make any changes to your enrollment, or if you wish to exit your recurring subscription, you can do so directly from your Parent Dashboard at any time before the renewal date.
          </Text>
          
          <Hr style={hr} />
          <Text style={footer}>
            Apollo Performing Arts & Academy<br />
            Nurturing the artists of tomorrow.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#020617", // slate-950
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const logo = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#34d399", // emerald-400
  textAlign: "center" as const,
  marginBottom: "30px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#cbd5e1", // slate-300
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#10b981", // emerald-500
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 24px",
  fontWeight: "bold",
};

const hr = {
  borderColor: "#1e293b", // slate-800
  margin: "20px 0",
};

const footer = {
  color: "#64748b", // slate-500
  fontSize: "12px",
  textAlign: "center" as const,
};
