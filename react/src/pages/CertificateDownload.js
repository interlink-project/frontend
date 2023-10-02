import {
    Box,
    Button,
    Typography,
    TextField,
    Paper,
    CircularProgress
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { useState } from "react";
import { usersApi } from "__api__";
import { ArchiveOutlined } from "@mui/icons-material";

const CertificateDownload = () => {

    const [privateCode, setPrivateCode] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            let fileToDownload=await usersApi.downloadUserCertificate(privateCode);
            setErrorMessage(null);
            return fileToDownload;
        } catch (error) {
            // Assuming your API might return a message in error.response.data.message
            // Adjust based on your actual error structure
            setErrorMessage(error.response?.data?.message || "There was a problem with the download operation, make sure the code is valid.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <Paper
                elevation={3}
                style={{
                    padding: '30px',
                    width: '400px',
                    maxWidth: '90%'
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    color="primary"
                    style={{
                       
                        marginBottom: '20px'
                    }}
                >
                    Certificate Download Page
                </Typography>

                <Typography variant="body1" align="center" style={{ marginBottom: '15px' }}>
                    Please enter your provided private code in the field below and click on the download button to retrieve your certificate.
                </Typography>

                <TextField
                    label="Enter Private Code"
                    variant="outlined"
                    value={privateCode}
                    onChange={(e) => setPrivateCode(e.target.value)}
                    fullWidth
                />
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownload}
                        startIcon={isDownloading ? <CircularProgress size={24} /> : <Download />}
                    >
                        Download Certificate
                    </Button>
                </Box>

                {errorMessage && <Typography color="error" style={{ marginTop: '15px', textAlign: 'center' }}>{errorMessage}</Typography>}
            </Paper>
        </Box>
    );
}

export default CertificateDownload;