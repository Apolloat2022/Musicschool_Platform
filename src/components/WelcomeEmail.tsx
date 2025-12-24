import { Html, Body, Container, Heading, Text, Button, Section } from '@react-email/components';

export default function WelcomeEmail({ studentName, className, classroomUrl }: { 
  studentName: string, 
  className: string, 
  classroomUrl: string 
}) {
  return (
    <Html>
      <Body style={{ backgroundColor: '#f9fafb', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <Heading style={{ color: '#4f46e5' }}>You're Enrolled! ??</Heading>
          <Text>Hi {studentName},</Text>
          <Text>You've successfully joined the <strong>{className}</strong> class. We're excited to see you there!</Text>
          
          <Section style={{ textAlign: 'center', margin: '30px 0' }}>
            <Button 
              href={classroomUrl}
              style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}
            >
              Go to Classroom
            </Button>
          </Section>
          
          <Text style={{ fontSize: '14px', color: '#6b7280' }}>
            Tip: Make sure your instrument is tuned and your camera is ready before the session starts!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
