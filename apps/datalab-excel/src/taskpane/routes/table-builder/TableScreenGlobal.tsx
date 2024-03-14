import { SelectedTableProvider, TableInfo } from "../../hooks/useSelectedTable";
import TableScreen from "./TableScreen";

export type Props = Readonly<{
    source: string;
    onCreated: (_tableInfo: TableInfo) => void;
  }>;
  
const TableScreenGlobal: React.FC<Props> = ({onCreated}) => {
    return (
        <SelectedTableProvider>
            <TableScreen onCreated={onCreated}/>
        </SelectedTableProvider>
    )
}

export default TableScreenGlobal;