import React from "react";
import { CircularProgress, Dialog, DialogContent, DialogTitle, LinearProgress } from "@mui/material";

interface LoadingPopupProps {
  open: boolean;
  progress: number;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ open, progress }) => {
  return (
    <Dialog open={open} id="loadingPopupVaule">
      <DialogTitle style={{ color: "#000000", fontWeight: "bold" }}>Importing CMG Data</DialogTitle>
      <DialogContent>
        <CircularProgress />
        <LinearProgress variant="determinate" value={progress} />
      </DialogContent>
    </Dialog>
  );
};

export default LoadingPopup;
