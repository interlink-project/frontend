import { Box, Container, Typography, Link, Paper } from "@mui/material";

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
          <Paper elevation={3} style={{ padding: "20px" }}>
            <HomeLogo style={{ width: "30%", height: "auto" }} />
            <br />
            <br />

            <div>
              <Typography variant="h4" gutterBottom>
                {t("Terms of Use")}
              </Typography>
              <br />

              <Typography variant="h6" paragraph>
              {t("AGREEMENTTOOURLEGALTERMS")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("WeareINTERLINKINTERLINKwe")}
                
              </Typography>
              <Typography variant="body1" paragraph>
                {t("Youcancontactusby")}
                
                <a href="mailto:info@interlink-project.eu">
                  info@interlink-project.eu
                </a>
              </Typography>

              <Typography variant="body1" paragraph>
                {t("TheseLegalTermsconstitutean")}
                
              </Typography>

              <Typography variant="body1" paragraph>
                {t("Wewillprovideyouwith")}
                
              </Typography>

              <Typography variant="body1" paragraph>
                {t("Bycontinuingtousethe")}
              </Typography>

              <Typography variant="body1" paragraph>
                {t("Alluserswhoareminors")}
              </Typography>

              <Typography variant="h6" paragraph>
                {t("1OURSERVICES")}
              
              </Typography>

              <Typography variant="body1" paragraph>
                {t("Theinformationprovidedwhenusing")}
                
              </Typography>

              <Typography variant="h6" paragraph>
                {t("2INTELLECTUALPROPERTYRIGHTS")}
                
              </Typography>

              <Typography variant="h6" paragraph>
                {t("Ourintellectualproperty")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("Wearetheowneror")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("InregardtoourIntellectual")}
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">
                  {t("BydefaultINTERLINKssoftwarecomponents")}
                    <a
                      href="https://www.apache.org/licenses/LICENSE-2.0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("Apache 20 license")}
                    </a>
                    .
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Proprietarylicensesprotectsomespecific")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("BydefaultknowledgeINTERLINKersdeveloped")}

                    <a
                      href="https://creativecommons.org/licenses/by-sa/4.0/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("Creative Commons license")}
                    </a>
                    .
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("SpecificknowledgeINTERLINKersdevelopedby")}
                  </Typography>
                </li>
              </ul>
              <Typography variant="body1" paragraph>
              {t("AnybreachoftheseIntellectual")}
              </Typography>

              <Typography variant="h6" paragraph>
                {t("Yoursubmissionsandcontributions")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Pleasereviewthissectionand")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("Contribution")}:
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Youareresponsibleforwhat")}
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">
                  {t("confirmthatyouhaveread")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("totheextentpermissibleby")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("warrantthatanysuchSubmission")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("warrantandrepresentthatyour")}
                  </Typography>
                </li>
              </ul>

              <Typography variant="body1" paragraph>
              {t("Youaresolelyresponsiblefor")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("Wemayremoveoredit")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("Copyrightinfringement")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Werespecttheintellectualproperty")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("3USERREPRESENTATIONS")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("ByusingtheServicesyou")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("4USERREGISTRATION")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Youarerequiredtoregister")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("5PROHIBITEDACTIVITIES")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Youmaynotaccessor")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("Asauserofthe")}
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">
                  {t("Systematicallyretrievedataorother")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Trickdefraudormisleadus")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Circumventdisableorotherwiseinterfere")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Disparagetarnishorotherwiseharm")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Useanyinformationobtainedfrom")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Makeimproperuseofour")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("UsetheServicesina")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Engageinunauthorisedframingof")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Uploadortransmitorattempt")}
                  </Typography>
                </li>

                <li>
                  <Typography variant="body1">
                  {t("Engageinanyautomateduse")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Deletethecopyrightorother")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Attempttoimpersonateanotheruser")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Uploadortransmitorattemptto")}
                  </Typography>
                </li>

                <li>
                  <Typography variant="body1">
                  {t("Interferewithdisruptorcreate")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Harassannoyintimidateorthreaten")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Attempttobypassanymeasures")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("CopyoradapttheServices")}
                  </Typography>
                </li>

                <li>
                  <Typography variant="body1">
                  {t("Exceptaspermittedbyapplicable")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Exceptasmaybethe")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Makeanyunauthoriseduseof")}
                  </Typography>
                </li>
              </ul>

              <Typography variant="h6" paragraph>
              {t("6USERGENERATEDCONTRIBUTIONS")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("TheServicesmayinviteyou")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("Whenyoucreateormake")}
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">
                  {t("Thecreationdistributiontransmissionpublic")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Youarethecreatorand")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("Youhavethewrittenconsent")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsarenotfalse")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsarenotunsolicited")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsarenotobscene")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsdonotridicule")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsarenotused")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsdonotviolate")}
                  </Typography>
                </li>

                <li>
                  <Typography variant="body1">
                  {t("YourContributionsdonotviolatethe")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsdonotviolateany")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsdonotinclude")}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  {t("YourContributionsdonototherwise")}
                  </Typography>
                </li>
              </ul>

              <Typography variant="body1" paragraph>
              {t("AnyuseoftheServices")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("7CONTRIBUTIONLICENCE")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("BydefaulttheINTERLINKersyou")}
              </Typography>

              <ul>
                <li>
                {t("For software INTERLINKers the")}
                  <a
                    href="https://www.apache.org/licenses/LICENSE-2.0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Apache 20 license")}
                  </a>
                </li>
                <li>
                {t("For knowledge INTERLINKers the")}
                  <a
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Creative Commons CC BYSA 40 license")}
                  </a>
                </li>
              </ul>

              <Typography variant="body1" paragraph>
              {t("Youretainthepossibilityto")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("8THIRDPARTYWEBSITESANDCONTENT")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("TheServicesmaycontainor")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("Inclusionoflinkingtoor")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("Youshouldreviewtheapplicable")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("Youagreeandacknowledgethat")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("9SERVICESMANAGEMENT")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Wereservetherightbut")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("10PRIVACYPOLICY")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Wecareaboutdataprivacy")}
                <a
                  href="https://interlink-project.eu/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </Typography>

              <Typography variant="h6" paragraph>
              {t("11COPYRIGHTINFRINGEMENTS")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Werespecttheintellectualpropertyrights")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("12TERMANDTERMINATION")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("TheseLegalTermsshallremain")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("WITHOUTLIMITINGANYOTHERPROVISION")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("Ifweterminateorsuspend")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("13MODIFICATIONSANDINTERRUPTIONS")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Wereservetherightto")}
              </Typography>

              <Typography variant="body1" paragraph>
              {t("WecannotguaranteetheServices")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("14GOVERNINGLAW")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("TheseLegalTermsaregoverned")}
              </Typography>

              <Typography variant="h6" paragraph>
              {t("15CONTACTUS")}
              </Typography>
              <Typography variant="body1" paragraph>
              {t("Inordertoresolvea")}
                <a href="mailto:info@interlink-project.eu">
                  info@interlink-project.eu
                </a>
                .
              </Typography>
            </div>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default TermsAndPrivacy;
