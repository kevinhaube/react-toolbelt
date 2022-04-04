import { FilterController } from "@normellis/react-network/hooks/UseFilterManager/UseFilterManager";

import { ICursorManager } from "../../network/hooks/UseCursorManager/UseCursorManager";

export type SortOrder = "ASC" | "DESC";
export interface TableRow {
    [key: string]: any;
}

/* ColumnConfig tells the Table element how to render each column, including the
 * data attribute of the object the column maps to, the header, and ... TODO: finish
 *
 * @property dataAttr: Name of the object attribute to be rendered in the column
 * @property columnHeader: The column name
 * @property sort: React.SetStateAction function */
export interface ColumnConfig {
    dataAttr: string;
    columnHeader: string;
    sortable?: boolean;
}

export interface TableConfig {
    columns: Array<ColumnConfig>;
    rows: Array<TableRow>;
}

export interface TableProps {
    config: TableConfig;
    filterManager: FilterController;
    pageController?: ICursorManager;
}

const Table = ({ config, filterManager, pageController }: TableProps) => {
    /* Renders the header row of the table from columns.values() */
    const TableHeaders = () => {
        return (
            <tr>
                {config.columns.map((colConfig) => {
                    if (colConfig.sortable) {
                        return (
                            <th
                                key={colConfig.columnHeader}
                                onClick={() => filterManager.swapSortOrder()}
                            >
                                {colConfig.columnHeader}
                            </th>
                        );
                    } else {
                        return (
                            <th key={colConfig.columnHeader}>
                                {colConfig.columnHeader}
                            </th>
                        );
                    }
                })}
            </tr>
        );
    };

    /* Iterates each row, and then uses the key value from columns.keys()
     * to render each cell in the appropriate column. */
    const TableRows = () => {
        return (
            <>
                {config.rows.map((object, rowIndex) => (
                    <tr key={rowIndex}>
                        {config.columns.map((col, colIndex) => (
                            <td key={`${rowIndex}:${colIndex}`}>
                                {object[col.dataAttr]}
                            </td>
                        ))}
                    </tr>
                ))}
            </>
        );
    };

    /* Handles pagination button logic and display */
    function PaginationButtons({ values, controller }: ICursorManager) {
        return (
            <div>
                {values.hasPrev && (
                    <button
                        onClick={() => controller.goTo(values.currentIndex - 1)}
                    >
                        <span>Previous</span>
                    </button>
                )}
                {values.hasNext && (
                    <button
                        onClick={() => controller.goTo(values.currentIndex + 1)}
                    >
                        <span>Next</span>
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            <table>
                <thead>
                    <TableHeaders />
                </thead>
                <tbody>
                    <TableRows />
                </tbody>
            </table>
            {pageController ? (
                <PaginationButtons
                    values={pageController.values}
                    controller={pageController.controller}
                />
            ) : null}
        </>
    );
};

export default Table;
