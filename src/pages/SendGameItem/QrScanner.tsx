/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Colors from '@theme/colors';

import QrReader from 'react-web-qr-reader';
import BackNavigation from '@components/BackNavigation';
import { useIsContractAddress } from '@hooks/useIsContractAddress';
import nodeProvider from '@services/provider/node';
import { useSendGameItem } from '@hooks/useSendGameItem';

interface QrScanInterface {
  binaryData: any[];
  data: string;
  chunks: any[];
  version: number;
  location: any;
}

interface QrScannerProps {
  activeCamera: boolean;
  setActiveCamera: Dispatch<SetStateAction<boolean>>;
  nftMetadata: NonNullable<ReturnType<typeof useSendGameItem>['nftMetadata']>;
  field: any;
}

const MainBox = styled(Box)({
  position: 'fixed',
  display: 'block',
  top: '41px',
  bottom: '0',
  left: '0',
  right: '0',
  width: '100vw',
  maxWidth: 'none !important',
  minHeight: '100vh',
  backgroundColor: Colors.appBackground,
  zIndex: '2',
  margin: '0',
  padding: '0',
  textAlign: 'center',
  overflow: 'auto',
});

const ScannerBox = styled(Container)({
  position: 'relative',
  width: '100%',
  maxWidth: 'calc(100vh - 120px) !important',
  minWidth: '300px !important',
  margin: 'auto',
  padding: '0',
  zIndex: '2',
  boxSizing: 'border-box',
  overflow: 'hidden',
});

const CancelButton = styled(Button)({
  position: 'relative',
  padding: '12px 16px',
  borderRadius: 3,
  bottom: '7px',
  left: '0',
  right: '0',
  width: '100%',
  margin: 'auto',
  marginBottom: '32px',
  marginTop: '20px',
});

const previewStyle = {
  height: '100%',
  width: '100%',
};

export const QrScanner: FC<QrScannerProps> = ({ activeCamera, setActiveCamera, nftMetadata, field }) => {
  const [readData, setReadData] = useState('');
  const [errorMsgBool, setErrorMsgBool] = useState(false);
  const [errorMsg, setErrorMsg] = useState(`${readData} is not a valid address...`);
  const {
    isLoading: isContractAddressLoading,
    isContractAddress,
    isValidAddress,
  } = useIsContractAddress(readData, nodeProvider[nftMetadata.chainId]);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(alertprops, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...alertprops} />;
  });

  const handleCloseErrorMsg = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorMsgBool(false);
  };

  const handleError = (error: any) => {
    console.error('Error scanning ', error);
  };

  const loadContractAddr = useCallback(async () => {
    if (readData && isContractAddress && isValidAddress) {
      field.onChange({ target: { value: readData } });
      setActiveCamera(false);
    } else if (readData && !isContractAddress && isValidAddress) {
      setErrorMsg(`${readData} is not a valid contract address...`);
      console.error(`${readData} is not a valid contract address...`);
      setErrorMsgBool(true);
      field.onChange({ target: { value: readData } });
      setActiveCamera(false);
    } else if (readData && !isContractAddress && !isValidAddress) {
      setErrorMsg(`${readData} is not a valid address...`);
      console.error(`${readData} is not a valid address...`);
      setErrorMsgBool(true);
    }
    setReadData('');
  }, [isContractAddress, isValidAddress, readData]);

  useEffect(() => {
    loadContractAddr();
  }, [isContractAddressLoading, isContractAddress, readData]);

  return (
    <>
      <Slide direction="up" in={activeCamera} mountOnEnter unmountOnExit>
        <MainBox>
          <BackNavigation
            label={`Send ${nftMetadata.data.name}`}
            onBackPress={() => setActiveCamera(false)}
            labelProps={{
              fontWeight: '600',
            }}
          />

          <ScannerBox
            sx={{
              border: isValidAddress ? '1px solid' : 'none',
              borderColor: isValidAddress ? 'red' : 'green',
            }}
          >
            {activeCamera ? (
              <>
                {/* for camera skeleton to be implemented */}
                {/* {cameraLoading ? <></> : null} */}
                <QrReader
                  delay={200}
                  style={previewStyle}
                  facingMode={'environment'}
                  showViewFinder={true}
                  onError={handleError}
                  resolution={800}
                  onScan={(res: any) => {
                    if (res) {
                      const qrscanResult: QrScanInterface = { ...res };
                      if (qrscanResult?.data) {
                        const qrCode: string = qrscanResult?.data.includes(':')
                          ? qrscanResult?.data.split(':')[1].trim()
                          : qrscanResult?.data;
                        setReadData(qrCode);
                      }
                    }
                  }}
                />
              </>
            ) : null}
          </ScannerBox>
          <CancelButton
            variant="contained"
            color="secondary"
            onClick={() => setActiveCamera(false)}
            sx={{
              maxWidth: { md: '120px', xs: 'none' },
            }}
          >
            Cancel
          </CancelButton>
        </MainBox>
      </Slide>
      <Snackbar open={errorMsgBool} autoHideDuration={4000} onClose={handleCloseErrorMsg}>
        <Alert onClose={handleCloseErrorMsg} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
};
