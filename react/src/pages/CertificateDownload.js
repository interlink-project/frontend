import {
    Box,
    Button,
    Typography,
    TextField,
    Paper,
    CircularProgress,
    InputAdornment,
    IconButton
} from "@mui/material";
import { Download,Visibility ,VisibilityOff  } from "@mui/icons-material";
import { useState } from "react";
import { usersApi } from "__api__";
import { ArchiveOutlined } from "@mui/icons-material";

const CertificateDownload = () => {

    const [privateCode, setPrivateCode] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
  
    const handleTogglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

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
                    Página de descarga de certificados
                </Typography>

                <Typography variant="body1" align="center" style={{ marginBottom: '15px' }}>
                Ingrese el código privado proporcionado en el campo a continuación y haga clic en el botón de descarga para recuperar su certificado.
                </Typography>

                <TextField
                    label="Enter Private Code"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={privateCode}
                    onChange={(e) => setPrivateCode(e.target.value)}
                    fullWidth

                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              edge="end"
                              onClick={handleTogglePasswordVisibility}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                />
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownload}
                        startIcon={isDownloading ? <CircularProgress size={24} /> : <Download />}
                    >
                        Descargar Certificado
                    </Button>
                </Box>

                {errorMessage && <Typography color="error" style={{ marginTop: '15px', textAlign: 'center' }}>{errorMessage}</Typography>}
            </Paper>
        </Box>
    );
}

export default CertificateDownload;