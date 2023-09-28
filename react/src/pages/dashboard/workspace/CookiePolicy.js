import {
  Box,
  Container,
  Typography,
  Link,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { HomeLogo } from "components/Logo";

import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  table: {
    borderCollapse: "collapse",
    border: "1px solid", // Set the color of the outer border here.
    borderColor: theme.palette.divider,
  },
  tableCell: {
    border: "1px solid", // Set the color of the cell borders here.
    borderColor: theme.palette.divider,
    textAlign: "center",
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  firstColumnCell: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    textAlign: "center",
  },
  regularCell: {
    textAlign: "center",
  },
}));

const CookiePolicy = () => {
  const { t } = useTranslation();

  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>{t("Cookie Policy")}</title>
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
                Cookie Policy of interlink-project.eu
              </Typography>
              <br />

              <Typography variant="body1" paragraph>
                In accordance with Article 13 of Regulation (EU) 2016/679 (GDPR)
                and the Provision of the Italian Data Protection Authority
                “Simplified Arrangements to Provide Information and Obtain
                Consent Regarding Cookies – 8 May 2014 no. 229”, Dedagroup
                S.p.A. (“Dedagroup” or “We”, “us”, “our”) undertakes a duty to
                provide a detailed information notice relating to the cookies
                installed on the website www.interlink-project.eu .
              </Typography>

              <Typography variant="body1" paragraph>
                This document informs Users about the technologies that help the
                Interlink website to achieve the purposes described below. Such
                technologies allow us to access and store information (for
                example by using a Cookie) or use resources (for example by
                running a script) on a User’s device as they interact with this
                website.
              </Typography>

              <Typography variant="h6" paragraph>
                What kind of technologies do we use?
              </Typography>
              <Typography variant="body1" paragraph>
                For simplicity, all such technologies are defined as “trackers”
                within this document – unless there is a reason to
                differentiate. For example, while cookies can be used on both
                web and mobile browsers, it would be inaccurate to talk about
                cookies in the context of mobile apps as they are a
                browser-based tracker. For this reason, within this document,
                the term cookies is only used where it is specifically meant to
                indicate that particular type of tracker.
              </Typography>

              <Typography variant="body1" paragraph>
                Some of the purposes for which trackers are used may also
                require the User’s consent. Whenever consent is given, it can be
                freely withdrawn at any time following the instructions provided
                in this document.
              </Typography>

              <Typography variant="body1" paragraph>
                This website uses trackers managed directly by us (so-called
                “first-party” trackers). The validity and expiration periods of
                cookies and other similar trackers may vary depending on the
                lifetime set by us. Some of them expire upon termination of the
                User’s browsing session. In addition to what’s specified in the
                descriptions within each of the categories below, Users may find
                more precise and updated information regarding lifetime
                specifications as well as any other relevant information – such
                as the presence of other trackers – in the linked privacy
                policies or by contacting Dedagroup S.p.A. at
                info@interlink-project.eu.
              </Typography>

              <Typography variant="body1" paragraph>
                Activities strictly necessary for the operation of this website
                and delivery of the Service This website uses so-called
                “technical” cookies and other similar tackers to carry out
                activities that are strictly necessary for the operation or
                delivery of the service.
              </Typography>

              <Typography variant="h6" paragraph>
                Other activities involving the use of trackers
              </Typography>
              <Typography variant="body1" paragraph>
                Measurement – This website uses trackers to measure traffic and
                analyze user behavior with the goal of improving the service. We
                use cookies in a range of ways to improve your experience on our
                site, including understanding how a user navigates the website.
              </Typography>

              <Typography variant="body1" paragraph>
                Anonymized analytics services: The services contained in this
                section allow the Owner, through the use of third-party
                trackers, to collect and manage analytics in an anonymized form.
                Google Analytics with anonymized IP Google Analytics is a web
                analysis service provided by Google LLC or by Google Ireland
                Limited, depending on the location this Website is accessed
                from, (“Google”). Google utilizes the Data collected to track
                and examine the use of this Website, prepare reports on its
                activities and share them with other Google services. Google may
                use the Data collected to contextualize and personalize the ads
                of its own advertising network. This integration of Google
                Analytics anonymizes your IP address. It works by shortening
                Users’ IP addresses within member states of the European Union
                or in other contracting states to the Agreement on the European
                Economic Area. Only in exceptional cases will the complete IP
                address be sent to a Google server and shortened within the US.
                Personal Data processed: Tracker and Usage Data. Place of
                processing: United States – Privacy Policy – Opt Out; Ireland –
                Privacy Policy – Opt Out.
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.headerCell}>
                      CATEGORY
                    </TableCell>
                    <TableCell className={classes.headerCell}>NAME</TableCell>
                    <TableCell className={classes.headerCell}>
                      SUPPLIER
                    </TableCell>
                    <TableCell className={classes.headerCell}>
                      DEADLINE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    ["Necessary", "elementor", "Elementor", "Persistent"],
                    ["Statistical", "_ga", "Google", "2 years"],
                    ["Statistical", "_gat", "Google", "1 day"],
                    ["Statistical", "_gid", "Google", "1 day"],
                  ].map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          className={
                            cellIndex === 0
                              ? `${classes.firstColumnCell} ${classes.tableCell}`
                              : `${classes.tableCell}`
                          }
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Typography variant="h4" gutterBottom>
                How to manage preferences and provide or withdraw consent?
              </Typography>

              <Typography variant="h6" paragraph>
                There are various ways to manage tracker related preferences and
                to provide and withdraw consent, where relevant:
              </Typography>
              <Typography variant="body1" paragraph>
                Users can manage preferences related to trackers directly within
                their own device settings, for example, by preventing the use or
                storage of trackers.
              </Typography>
              <Typography variant="body1" paragraph>
                Additionally, whenever the use of trackers is based on consent,
                Users can provide or withdraw such consent by setting their
                preferences within the cookie notice or by updating such
                preferences accordingly via the relevant consent-preferences
                widget.
              </Typography>
              <Typography variant="body1" paragraph>
                It is also possible, via relevant browser or device features, to
                delete previously stored trackers, including those used to
                remember the User’s initial consent.
              </Typography>
              <Typography variant="body1" paragraph>
                Other trackers in the browser’s local memory may be cleared by
                deleting the browsing history.
              </Typography>

              <Typography variant="h6" paragraph>
                Locating Tracker Settings
              </Typography>
              <Typography variant="body1" paragraph>
                Users can, for example, find information about how to manage
                cookies in the most commonly used browsers at the following
                addresses:
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1">Google Chrome</Typography>
                </li>
                <li>
                  <Typography variant="body1">Mozilla Firefox</Typography>
                </li>
                <li>
                  <Typography variant="body1">Apple Safari</Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Microsoft Internet Explorer
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">Microsoft Edge</Typography>
                </li>
                <li>
                  <Typography variant="body1">Brave</Typography>
                </li>
                <li>
                  <Typography variant="body1">Opera</Typography>
                </li>
              </ul>

              <Typography variant="body1" paragraph>
                Users may also manage certain categories of trackers used on
                mobile apps by opting out through relevant device settings such
                as the device advertising settings for mobile devices, or
                tracking settings in general (Users may open the device settings
                and look for the relevant setting).
              </Typography>

              <Typography variant="h6" paragraph>
                Data Controller
              </Typography>

              <Box>
                <Typography variant="body1">Dedagroup S.p.A.</Typography>
                <Typography variant="body1">Via di Spini, 50</Typography>
                <Typography variant="body1">
                  38121 - Località Produttiva I TN
                </Typography>
                <Typography variant="body1">Italy</Typography>
              </Box>

              <Typography variant="h6" paragraph>
                Data Protection Officer (DPO)
              </Typography>

              <Box>
                <Typography variant="body1">
                  Mrs. Monica Perego: dpo@dedagroup.it
                </Typography>
              </Box>

              <Typography variant="h6" paragraph>
                Data Processor
              </Typography>

              <Box>
                <Typography variant="body1">
                  Smart Community Lab, FBK
                </Typography>
                <Typography variant="body1">via Sommarive 18</Typography>
                <Typography variant="body1">
                  38123 Povo (Trento), Italy
                </Typography>
                <Typography variant="body1">
                  Controller contact email: info@interlink-project.eu
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
                Given the objective complexity surrounding tracking
                technologies, Users are encouraged to contact Dedagroup S.p.A.
                at info@interlink-project.eu should they wish to receive any
                further information on the use of such technologies by this
                website.
              </Typography>

              <Typography variant="body1" paragraph>
                This project has received funding from the European Union’s
                Horizon 2020 research and Innovation programme under Grant
                Agreement 959201
              </Typography>
            </div>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default CookiePolicy;
