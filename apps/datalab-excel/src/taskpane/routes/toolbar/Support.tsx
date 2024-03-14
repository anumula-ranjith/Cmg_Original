import { Box } from "@mui/material";
import { SelectedTableProvider } from "../../hooks/useSelectedTable";
import ToolBar from "./Toolbar";


const Support = () => {
    return (<SelectedTableProvider>
        <ToolBar title="Support" />
        <Box mt={2} mb={2}>
            Have questions or need assistance?
            <br />
            Contact <b>support@cmgx.io</b>
        </Box>
    </SelectedTableProvider>)
}
export default Support;