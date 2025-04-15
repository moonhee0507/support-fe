import { RowData } from "@/app/clone/page";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { useState } from "react";

interface ILoadedTableProps {
    dataset: RowData[];
}

const LoadedTable = ({ dataset }: ILoadedTableProps) => {
    const heads = dataset[0] as string[];
    const rows = dataset.slice(1);

    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        console.log(index)
        setHoveredColumn(index); // 마우스가 올라간 열 인덱스 설정
    };

    const handleMouseLeave = () => {
        setHoveredColumn(null); // 마우스가 떠나면 강조 해제
    };

    const handleHeadClick = async (i: number) => {
        const isConfirmed = window.confirm("Clone these repositories?");
        if (!isConfirmed) return;

        const applicantNumbers = rows.map((r) => r[0]);
        const cloneUrls = rows.map((r) => r[i]);
        console.log(applicantNumbers);
        console.log(cloneUrls);

       try {
        const response = await fetch("/clone/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ applicantNumbers, cloneUrls }),
        });

        if (!response.ok) {
            throw new Error("Failed to start clone operation");
        }

        const result = await response.json();
        console.log(result.message);
       } catch (error) {
        console.error("Error:", error);
       }

    }

    return(
        <Table>
            <TableHeader>
                <TableRow>
                    {
                        heads.map((h, i) => (
                            <TableHead
                                key={`head-${i}`}
                                onClick={() => handleHeadClick(i)}
                                onMouseEnter={() => handleMouseEnter(i)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {h}
                            </TableHead>
                        ))
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    rows.map((r, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`}>
                            {
                                r.map((c, colIndex) => <TableCell key={`cell-${rowIndex}-${colIndex}`} className={hoveredColumn === colIndex ? "bg-secondary text-secondary-foreground" : ""}>{c}</TableCell>)
                            }
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
};

export default LoadedTable;