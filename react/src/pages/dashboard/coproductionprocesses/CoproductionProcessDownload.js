import {
  Box, Container
  } from '@mui/material';
import { coproductionProcessesApi } from '__api__';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import useMounted from 'hooks/useMounted';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';





const CoproductionProcessDownload = () => {
    const { processId } = useParams();
    const mounted = useMounted();
    const navigate = useNavigate();

    useEffect(() => {
        coproductionProcessesApi.download(processId).then((res) => {
            if (mounted.current) {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'process.zip'); 
                document.body.appendChild(link);
                link.click();
                navigate(`/dashboard/coproductionprocesses/${processId}/guide`);
            }
        });
    }, [processId, mounted]);
  

  
    return (
    <></>
    );
};

export default CoproductionProcessDownload;
