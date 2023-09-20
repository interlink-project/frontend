import {
    Box,
    Container,
    Typography, Link
  } from "@mui/material";
  import AuthGuardSkeleton from "components/guards/AuthGuardSkeleton";
  import React from "react";
  import { Helmet } from "react-helmet-async";
  import { useTranslation } from "react-i18next";

  
  
const TermsAndPrivacy = () => {

    const { t } = useTranslation();

    return (
        <>
          <Helmet>
            <title>{t("Terms and Privacy")}</title>
          </Helmet>
          <Box
            sx={{
              backgroundColor: "background.default",
              minHeight: "100%",
              py: 5,
              px: 1,
            }}
          >
            <Container maxWidth="lg">
              <AuthGuardSkeleton height="60vh" width="100%">
               
               
              <div>
      <Typography variant="h4" gutterBottom>
        Terms of Use
      </Typography>

      <Typography variant="h6" paragraph>
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to our Collaborative Platform. These terms govern your use of the platform. By accessing this platform, you agree to be bound by the terms outlined herein.
      </Typography>

      <Typography variant="h6" paragraph>
        2. User Obligations
      </Typography>
      <Typography variant="body1" paragraph>
        Users are responsible for the security of their accounts and must ensure that content posted complies with the law and respects the rights and dignity of others.
      </Typography>

      <Typography variant="h6" paragraph>
        3. Intellectual Property
      </Typography>
      <Typography variant="body1" paragraph>
        All content on this platform is protected by intellectual property laws. Users must not reproduce, distribute, modify or create derivative works of any content, except with explicit permission.
      </Typography>

      <Typography variant="h6" paragraph>
        4. Limitation of Liability
      </Typography>
      <Typography variant="body1" paragraph>
        The platform is provided "as is" and we disclaim all warranties and liabilities, to the extent permitted by law, regarding the functionality, reliability, or accuracy of the platform.
      </Typography>

      <Typography variant="h4" gutterBottom>
        Privacy Policy (GDPR & ePrivacy Directive compliant)
      </Typography>

      <Typography variant="h6" paragraph>
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        We are committed to protecting your personal data and respecting your privacy. This policy outlines the manner in which we collect, use, and disclose your personal data in compliance with the GDPR and ePrivacy Directive.
      </Typography>

      <Typography variant="h6" paragraph>
        2. Data Collection
      </Typography>
      <Typography variant="body1" paragraph>
        We collect personal data voluntarily provided by you, such as name, email, and contact details. Information about your platform usage, including IP address and device type, is also collected to improve user experience.
      </Typography>

      <Typography variant="h6" paragraph>
        3. Data Use
      </Typography>
      <Typography variant="body1" paragraph>
        We use collected data to offer personalized experiences, improve our services, and comply with legal obligations.
      </Typography>

      <Typography variant="h6" paragraph>
        4. Data Protection
      </Typography>
      <Typography variant="body1" paragraph>
        We employ stringent data protection measures to safeguard your information against unauthorized access, disclosure, alteration, and destruction.
      </Typography>

      <Typography variant="h6" paragraph>
        5. Your Rights
      </Typography>
      <Typography variant="body1" paragraph>
        You have the right to access, rectify, or delete your personal data held by us. You can also object to or restrict the processing of your data under certain conditions.
      </Typography>

      <Typography variant="body2" paragraph>
        For detailed understanding of these terms and our privacy practices, please <Link href="#contact_us" underline="always">contact us</Link>.
      </Typography>
    </div>





              </AuthGuardSkeleton>
            </Container>
          </Box>
    
          
        </>
      );


};


export default TermsAndPrivacy;