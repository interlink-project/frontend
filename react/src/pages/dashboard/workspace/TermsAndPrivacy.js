import { Box, Container, Typography, Link } from "@mui/material";

import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { HomeLogo } from "components/Logo";

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
        <HomeLogo style={{ width: "40%", height: "auto" }} />
          
          
            <div>
              <Typography variant="h4" gutterBottom>
                Terms of Use
              </Typography>

              <Typography variant="h6" paragraph>
                AGREEMENT TO OUR LEGAL TERMS
              </Typography>
              <Typography variant="body1" paragraph>
                We are INTERLINK (‘INTERLINK’, 'we', 'us', or 'our'). We operate
                the INTERLINK platform (the ‘platform’), as well as any other
                related products and services that refer or link to these legal
                terms (the 'Legal Terms') (collectively, the 'Services').The
                INTERLINK platform aims to develop a new collaborative
                governance model that promotes the reuse and sharing of existing
                public services leveraging on the partnership between citizens,
                private actors, and public administrations.
              </Typography>
              <Typography variant="body1" paragraph>
                You can contact us by email at info@interlink-project.eu
              </Typography>

              <Typography variant="body1" paragraph>
                These Legal Terms constitute an agreement made between you,
                whether personally or on behalf of an entity ('you'), and
                INTERLINK, concerning your access to and use of the Services.
                You agree that by accessing the Services, you have read,
                understood, and agreed to be bound by all of these Legal Terms.
              </Typography>

              <Typography variant="body1" paragraph>
                We will provide you with prior notice of any scheduled changes
                to the Services you are using. Changes to Legal Terms will
                become effective seven (7) days after the notice is given.
              </Typography>

              <Typography variant="body1" paragraph>
                By continuing to use the Services after the effective date of
                any changes, you agree to be bound by the modified terms. If you
                disagree with such changes, you may terminate Services as per
                the section 'TERM AND TERMINATION'.
              </Typography>

              <Typography variant="body1" paragraph>
                All users who are minors in the jurisdiction in which they
                reside (generally under the age of 18) must have the permission
                of, and be directly supervised by, their parent or guardian to
                use the Services. If you are a minor, you must have your parent
                or guardian read and agree to these Legal Terms prior to you
                using the Services.
              </Typography>

              <Typography variant="h6" paragraph>
                2. User Obligations
              </Typography>
              <Typography variant="body1" paragraph>
                Users are responsible for the security of their accounts and
                must ensure that content posted complies with the law and
                respects the rights and dignity of others.
              </Typography>

              <Typography variant="h6" paragraph>
                1. OUR SERVICES
              </Typography>

              <Typography variant="body1" paragraph>
                The information provided when using the Services is not intended
                for distribution to or use by any person or entity in any
                jurisdiction or country where such distribution or use would be
                contrary to law or regulation or which would subject us to any
                registration requirement within such jurisdiction or country.
                Accordingly, those persons who choose to access the Services
                from other locations do so on their own initiative and are
                solely responsible for compliance with local laws, if and to the
                extent local laws are applicable
              </Typography>

              <Typography variant="h6" paragraph>
                2. INTELLECTUAL PROPERTY RIGHTS
              </Typography>

              <Typography variant="h6" paragraph>
                Our intellectual property
              </Typography>

              <Typography variant="body1" paragraph>
                We are the owner or the licensee of all intellectual property
                rights in our Services, including all source code, databases,
                functionality, software, website designs, audio, video, text,
                photographs, and graphics in the Services (collectively, the
                'Content'). Our Content is protected by copyright.
              </Typography>

              <Typography variant="body1" paragraph>
                In regard to our Intellectual Property on software components of
                the platforms and knowledge INTERLINKers, INTERLINK follows the
                following policy :
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">
                    By default, INTERLINK’s software components and software
                    INTERLINKers are open-source under the Apache 2.0 license.
                    Those components can be reused by respecting the
                    requirements sent out by the Apache 2.0 license
                    (https://www.apache.org/licenses/LICENSE-2.0)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Proprietary licenses protect some specific software
                    components. A list of these specifics component is available
                    here. They require prior authorization before reuse.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    By default, knowledge INTERLINKers developed by INTERLINK
                    are open-source under Creative Commons CC BY-SA 4.0
                    (Attribution - Share Alike). Those INTERLINKERScan be reused
                    by respecting the requirements sent out by the Creative
                    Commons license.
                    (https://creativecommons.org/licenses/by-sa/4.0/)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Specific knowledge INTERLINKers developed by INTERLINK are
                    proprietary, as indicated in the INTERLINKer description.
                    They require prior authorization before reuse.
                  </Typography>
                </li>
              </ul>
              <Typography variant="body1" paragraph>
                Any breach of these Intellectual Property Rights will constitute
                a material breach of our Legal Terms and your right to use our
                Services will terminate immediately.
              </Typography>

              <Typography variant="h6" paragraph>
                Your submissions and contributions
              </Typography>
              <Typography variant="body1" paragraph>
                Please review this section and the 'PROHIBITED ACTIVITIES'
                section carefully prior to using our Services to understand the
                (a) rights you give us and (b) obligations you have when you
                post or upload any content through the Services.
              </Typography>

              <Typography variant="h6" paragraph>
                Contribution:
              </Typography>
              <Typography variant="body1" paragraph>
                You are responsible for what you post or upload: By sending us
                Submissions and/or posting Contributions through any part of the
                Services or making Contributions accessible through the Services
                by linking your account through the Services to any of your
                social networking accounts, you:
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">
                    confirm that you have read and agree with our 'PROHIBITED
                    ACTIVITIES' and will not post, send, publish, upload, or
                    transmit through the Services any Submission nor post any
                    Contribution that is illegal, harassing, hateful, harmful,
                    defamatory, obscene, bullying, abusive, discriminatory,
                    threatening to any person or group, sexually explicit,
                    false, inaccurate, deceitful, or misleading;
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    to the extent permissible by applicable law, waive any and
                    all moral rights to any such Submission and/or Contribution;
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    warrant that any such Submission and/or Contributions are
                    original to you or that you have the necessary rights and
                    licences to submit such Submissions and/or Contributions and
                    that you have full authority to grant us the above-mentioned
                    rights in relation to your Submissions and/or Contributions;
                    and
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    warrant and represent that your Submissions and/or
                    Contributions do not constitute confidential information.
                  </Typography>
                </li>
              </ul>

              <Typography variant="body1" paragraph>
                You are solely responsible for your Submissions and/or
                Contributions and you expressly agree to reimburse us for any
                and all losses that we may suffer because of your breach of (a)
                those legal terms, (b) any third party’s intellectual property
                rights, or (c) applicable law.
              </Typography>

              <Typography variant="body1" paragraph>
                We may remove or edit your Content: Although we have no
                obligation to monitor any Contributions, we shall have the right
                to remove or edit any Contributions at any time without notice
                if in our reasonable opinion we consider such Contributions
                harmful or in breach of these Legal Terms. If we remove or edit
                any such Contributions, we may also suspend or disable your
                account and report you to the authorities.
              </Typography>

              <Typography variant="h6" paragraph>
                Copyright infringement
              </Typography>
              <Typography variant="body1" paragraph>
                We respect the intellectual property rights of others. If you
                believe that any material available on or through the Services
                infringes upon any copyright you own or control, please
                immediately refer to the 'COPYRIGHT INFRINGEMENTS' section
                below.
              </Typography>

              <Typography variant="h6" paragraph>
                3. USER REPRESENTATIONS
              </Typography>
              <Typography variant="body1" paragraph>
                By using the Services, you represent and warrant that: (1) all
                registration information you submitwill be true, accurate,
                current, and complete; (2) you will maintain the accuracy of
                such information and promptly update such registration
                information as necessary; (3) you have the legal capacity and
                you agree to comply with these Legal Terms; (4) you are not a
                minor in the jurisdiction in which you reside, or if a minor,
                you have received parental permission to use the Services; (5)
                you will not access the Services through automated or non-human
                means, whether through a bot, script or otherwise; (6) you will
                not use the Services for any illegal or unauthorised purpose;
                and (7) your use of the Services will not violate any applicable
                law or regulation.
              </Typography>

              <Typography variant="h6" paragraph>
                4. USER REGISTRATION
              </Typography>
              <Typography variant="body1" paragraph>
                You are required to register to use the Services. You agree to
                keep your password confidential and will be responsible for all
                use of your account and password. We reserve the right to
                remove, reclaim, or change a username you select if we
                determine, in our sole discretion, that such username is
                inappropriate, obscene, or otherwise objectionable.
              </Typography>

              <Typography variant="h6" paragraph>
                5. PROHIBITED ACTIVITIES
              </Typography>
              <Typography variant="body1" paragraph>
                You may not access or use the Services for any purpose other
                than that for which we make the Services available. The Services
                may not be used in connection with any commercial endeavours
                except those that are specifically endorsed or approved by us.
              </Typography>

              <Typography variant="body1" paragraph>
                As a user of the Services, you agree not to:
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">
                    Systematically retrieve data or other content from the
                    Services to create or compile, directly or indirectly, a
                    collection, compilation, database, or directory without
                    written permission from us.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Trick, defraud, or mislead us and other users, especially in
                    any attempt to learn sensitive account information such as
                    user passwords.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Circumvent, disable, or otherwise interfere with
                    security-related features of the Services, including
                    features that prevent or restrict the use or copying of any
                    Content or enforce limitations on the use of the Services
                    and/or the Content contained therein.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Disparage, tarnish, or otherwise harm, in our opinion, us
                    and/or the Services.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Use any information obtained from the Services in order to
                    harass, abuse, or harm another person.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Make improper use of our support services or submit false
                    reports of abuse or misconduct.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Use the Services in a manner inconsistent with any
                    applicable laws or regulations.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Engage in unauthorised framing of or linking to the
                    Services.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Upload or transmit (or attempt to upload or to transmit)
                    viruses, Trojan horses, or other material, including
                    excessive use of capital letters and spamming (continuous
                    posting of repetitive text), that interferes with any
                    party’s uninterrupted use and enjoyment of the Services or
                    modifies, impairs, disrupts, alters, or interferes with the
                    use, features, functions, operation, or maintenance of the
                    Services.
                  </Typography>
                </li>

                <li>
                  <Typography variant="body1">
                    Engage in any automated use of the system, such as using
                    scripts to send comments or messages, or using any data
                    mining, robots, or similar data gathering and extraction
                    tools.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Delete the copyright or other proprietary rights notice from
                    any Content.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Attempt to impersonate another user or person or use the
                    username of another user.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Upload or transmit (or attempt to upload or to transmit) any
                    material that acts as a passive or active information
                    collection or transmission mechanism, including without
                    limitation, clear graphics interchange formats ('gifs'), 1×1
                    pixels, web bugs, cookies, or other similar devices
                    (sometimes referred to as 'spyware' or 'passive collection
                    mechanisms' or 'pcms').
                  </Typography>
                </li>

                <li>
                  <Typography variant="body1">
                    Interfere with, disrupt, or create an undue burden on the
                    Services or the networks or services connected to the
                    Services.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Harass, annoy, intimidate, or threaten any of our employees
                    or agents engaged in providing any portion of the Services
                    to you.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Attempt to bypass any measures of the Services designed to
                    prevent or restrict access to the Services, or any portion
                    of the Services.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Copy or adapt the Services' software, including but not
                    limited to Flash, PHP, HTML, JavaScript, or other code.
                  </Typography>
                </li>

                <li>
                  <Typography variant="body1">
                    Except as permitted by applicable law, decipher, decompile,
                    disassemble, or reverse engineer any of the software
                    comprising or in any way making up a part of the Services.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Except as may be the result of standard search engine or
                    Internet browser usage, use, launch, develop, or distribute
                    any automated system, including without limitation, any
                    spider, robot, cheat utility, scraper, or offline reader
                    that accesses the Services, or use or launch any
                    unauthorised script or other software.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Make any unauthorised use of the Services, including
                    collecting usernames and/or email addresses of users by
                    electronic or other means for the purpose of sending
                    unsolicited email, or creating user accounts by automated
                    means or under false pretences.
                  </Typography>
                </li>
              </ul>

              <Typography variant="h6" paragraph>
                6. USER GENERATED CONTRIBUTIONS
              </Typography>
              <Typography variant="body1" paragraph>
                The Services may invite you to chat, contribute to, or
                participate in blogs, message boards, online forums, and other
                functionality, and may provide you with the opportunity to
                create, submit, post, display, transmit, perform, publish,
                distribute, or broadcast content and materials to us or on the
                Services, including but not limited to text, writings, video,
                audio, photographs, graphics, comments, suggestions
                spreadsheets, presentations, collaboration boards, or personal
                information or other material (collectively, 'Contributions').
                Contributions may be viewable by other users of the Services and
                through third-party websites. As such, any Contributions you
                transmit may be treated as non-confidential and non-proprietary.
              </Typography>

              <Typography variant="body1" paragraph>
                When you create or make available any Contributions, you thereby
                represent and warrant that:
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">
                    The creation, distribution, transmission, public display, or
                    performance, and the accessing, downloading, or copying of
                    your Contributions do not and will not infringe the
                    proprietary rights, including but not limited to the
                    copyright, patent, trademark, trade secret, or moral rights
                    of any third party.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    You are the creator and owner of or have the necessary
                    licences, rights, consents, releases, and permissions to use
                    and to authorise us, the Services, and other users of the
                    Services to use your Contributions in any manner
                    contemplated by the Services and these Legal Terms.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    You have the written consent, release, and/or permission of
                    each and every identifiable individual person in your
                    Contributions to use the name or likeness of each and every
                    such identifiable individual person to enable inclusion and
                    use of your Contributions in any manner contemplated by the
                    Services and these Legal Terms.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions are not false, inaccurate, or misleading.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions are not unsolicited or unauthorised
                    advertising, promotional materials, pyramid schemes, chain
                    letters, spam, mass mailings, or other forms of
                    solicitation.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions are not obscene, lewd, lascivious,
                    filthy, violent, harassing, libellous, slanderous, or
                    otherwise objectionable (as determined by us).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions do not ridicule, mock, disparage,
                    intimidate, or abuse anyone.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions are not used to harass or threaten (in
                    the legal sense of those terms) any other person and to
                    promote violence against a specific person or class of
                    people.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions do not violate any applicable law,
                    regulation, or rule.
                  </Typography>
                </li>

                <li>
                  <Typography variant="body1">
                    Your Contributions do not violate the privacy or publicity
                    rights of any third party.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions do not violate any applicable law
                    concerning child pornography, or otherwise intended to
                    protect the health or well-being of minors.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions do not include any offensive comments
                    that are connected to race, national origin, gender, sexual
                    preference, or physical handicap.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Your Contributions do not otherwise violate, or link to
                    material that violates, any provision of these Legal Terms,
                    or any applicable law or regulation.
                  </Typography>
                </li>
              </ul>

              <Typography variant="body1" paragraph>
                YAny use of the Services in violation of the foregoing violates
                these Legal Terms and may result in, among other things,
                termination or suspension of your rights to use the Services.
              </Typography>

              <Typography variant="h6" paragraph>
                7. CONTRIBUTION LICENCE
              </Typography>
              <Typography variant="body1" paragraph>
                By default, the INTERLINKers you contribute with on the
                INTERLINK platform will be open-source under the following
                licenses :
              </Typography>

              <ul>
                <li>
                  For software INTERLINKers, the Apache 2.0 license
                  (https://www.apache.org/licenses/LICENSE-2.0)
                </li>
                <li>
                  For knowledge INTERLINKers, the Creative Commons CC BY-SA 4.0
                  license (https://creativecommons.org/licenses/by-sa/4.0/)
                </li>
              </ul>

              <Typography variant="body1" paragraph>
                You remain the possibility to rely on other methods to protect
                your intellectual property on the INTERLINK platform. In that
                case, it is your responsibility to select the appropriate
                methods to do so and to clearly indicate it in the description
                of the specified INTERLINKer.
              </Typography>

              <Typography variant="h6" paragraph>
                8. THIRD-PARTY WEBSITES AND CONTENT
              </Typography>
              <Typography variant="body1" paragraph>
                The Services may contain (or you may be sent via the Site) links
                to other websites ('Third-Party Websites') as well as articles,
                photographs, text, files, graphics, pictures, designs, music,
                sound, video, information, applications, software, and other
                content or items belonging to or originating from third parties
                ('Third-Party Content'). Such Third-Party Websites and
                Third-Party Content are not investigated, monitored, or checked
                for accuracy, appropriateness, or completeness by us, and we are
                not responsible for any Third-Party Websites accessed through
                the Services or any Third-Party Content posted on, available
                through, or installed from the Services, including the content,
                accuracy, offensiveness, opinions, reliability, privacy
                practices, or other policies of or contained in the Third-Party
                Websites or the Third-Party Content.
              </Typography>

              <Typography variant="body1" paragraph>
                Inclusion of, linking to, or permitting the use or installation
                of any Third-Party Websites or any Third-Party Content does not
                imply approval or endorsement thereof by us. If you decide to
                leave the Services and access the Third-Party Websites or to use
                or install any Third-Party Content, you do so at your own risk,
                and you should be aware these Legal Terms no longer govern.
              </Typography>

              <Typography variant="body1" paragraph>
                You should review the applicable terms and policies, including
                privacy and data gathering practices, of any website to which
                you navigate from the Services or relating to any applications
                you use or install from the Services.
              </Typography>

              <Typography variant="body1" paragraph>
                You agree and acknowledge that we do not endorse the products or
                services offered on Third-Party Websites and you shall hold us
                blameless from any harm caused by your purchase of such products
                or services. Additionally, you shall hold us blameless from any
                losses sustained by you or harm caused to you relating to or
                resulting in any way from any Third-Party Content or any contact
                with Third-Party Websites.
              </Typography>

              <Typography variant="h6" paragraph>
                9. SERVICES MANAGEMENT
              </Typography>
              <Typography variant="body1" paragraph>
                We reserve the right, but not the obligation, to: (1) monitor
                the Services for violations of these Legal Terms; (2) take
                appropriate legal action against anyone who, in our sole
                discretion, violates the law or these Legal Terms, including
                without limitation, reporting such user to law enforcement
                authorities; (3) in our sole discretion and without limitation,
                refuse, restrict access to, limit the availability of, or
                disable (to the extent technologically feasible) any of your
                Contributions or any portion thereof; (4) in our sole discretion
                and without limitation, notice, or liability, to remove from the
                Services or otherwise disable all files and content that are
                excessive in size or are in any way burdensome to our systems;
                and (5) otherwise manage the Services in a manner designed to
                protect our rights and property and to facilitate the proper
                functioning of the Services.
              </Typography>

              <Typography variant="h6" paragraph>
                10. PRIVACY POLICY
              </Typography>
              <Typography variant="body1" paragraph>
                We care about data privacy and security. Please review our
                Privacy Policy im the link.
              </Typography>

              <Typography variant="h6" paragraph>
                11. COPYRIGHT INFRINGEMENTS
              </Typography>
              <Typography variant="body1" paragraph>
                We respect the intellectual property rights of others. If you
                believe that any material available on or through the Services
                infringes upon any copyright you own or control, please
                immediately notify us using the contact information provided
                below (a 'Notification'). A copy of your Notification will be
                sent to the person who posted or stored the material addressed
                in the Notification.
              </Typography>

              <Typography variant="h6" paragraph>
                12. TÉRMINO Y TERMINACIÓN
              </Typography>
              <Typography variant="body1" paragraph>
                These Legal Terms shall remain in full force and effect while
                you use the Services.
              </Typography>

              <Typography variant="body1" paragraph>
                WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE
                RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE
                OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING
                BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR
                FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY
                REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL
                TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE
                YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT
                AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME,
                WITHOUT WARNING, IN OUR SOLE DISCRETION.
              </Typography>

              <Typography variant="body1" paragraph>
                If we terminate or suspend your account for any reason, you are
                prohibited from registering and creating a new account under
                your name, a fake or borrowed name, or the name of any third
                party, even if you may be acting on behalf of the third party.
                In addition to terminating or suspending your account, we
                reserve the right to take appropriate legal action, including
                without limitation pursuing civil, criminal, and injunctive
                redress.
              </Typography>

              <Typography variant="h6" paragraph>
                13. MODIFICATIONS AND INTERRUPTIONS
              </Typography>
              <Typography variant="body1" paragraph>
                We reserve the right to change, modify, or remove the contents
                of the Services at any time or for any reason at our sole
                discretion without notice. However, we have no obligation to
                update any information on our Services. We will not be liable to
                you or any third party for any modification, price change,
                suspension, or discontinuance of the Services.
              </Typography>

              <Typography variant="body1" paragraph>
                We cannot guarantee the Services will be available at all times.
                We may experience hardware, software, or other problems or need
                to perform maintenance related to the Services, resulting in
                interruptions, delays, or errors. We reserve the right to
                change, revise, update, suspend, discontinue, or otherwise
                modify the Services at any time or for any reason without notice
                to you. You agree that we have no liability whatsoever for any
                loss, damage, or inconvenience caused by your inability to
                access or use the Services during any downtime or discontinuance
                of the Services. Nothing in these Legal Terms will be construed
                to obligate us to maintain and support the Services or to supply
                any corrections, updates, or releases in connection therewith.
              </Typography>

              <Typography variant="h6" paragraph>
                14. GOVERNING LAW
              </Typography>
              <Typography variant="body1" paragraph>
                These Legal Terms are governed by and interpreted following the
                laws of Belgium.
              </Typography>

              <Typography variant="h6" paragraph>
                15. CONTACT US
              </Typography>
              <Typography variant="body1" paragraph>
                In order to resolve a complaint regarding the Services or to
                receive further information regarding use of the Services,
                please contact XXXX
              </Typography>
            </div>
        
        </Container>
      </Box>
    </>
  );
};

export default TermsAndPrivacy;
