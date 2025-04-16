import { RowData } from "@/app/clone/page";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Button } from "./ui/button";

interface ILoadedTableProps {
    dataset: RowData[];
}

const LoadedTable = ({ dataset }: ILoadedTableProps) => {
    const heads = dataset[0] as string[];
    const rows = dataset.slice(1);

    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
    const [command, setCommand] = useState<string | null>(null);

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

    //    try {
    //     const response = await fetch("/clone/api", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ applicantNumbers, cloneUrls }),
    //     });

    //     if (!response.ok) {
    //         throw new Error("Failed to start clone operation");
    //     }

    //     const result = await response.json();
    //     console.log(result.message);
    //    } catch (error) {
    //     console.error("Error:", error);
    //    }

        handleGenerateCloneCommands(applicantNumbers, cloneUrls);

    }

    const handleGenerateCloneCommands = (applicantNumbers: (number | string | null)[], cloneUrls: (number | string | null)[]) => {
        if (applicantNumbers.length !== cloneUrls.length) {
            alert("지원자 번호와 URL의 개수가 일치하지 않습니다.");
            return;
        }

        const applicantNumbersAreEmpty = applicantNumbers.some((i) => i === null || i === "");
        if (applicantNumbersAreEmpty) {
            alert("비어있는 지원자 번호가 있습니다.");
            return;
        }
        
        const commands = applicantNumbers.map((number, index) => {
            return `git clone ${cloneUrls[index]} ${number}`;
        }).join("\n");
        console.log(commands);
        setCommand(commands);
    };

    return(
        <>
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
            {
                command && (
                    <Dialog open={!!command} onOpenChange={() => setCommand(null)}>
                        <DialogContent className="">
                            <DialogHeader>
                                <DialogTitle>Git 명령어</DialogTitle>
                                <DialogDescription>
                                    아래 명령어를 복사하여 터미널에 붙여넣기 하세요.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="overflow-x-auto max-h-[300px] bg-secondary p-4">
                                <pre className="text-xs font-mono text-secondary-foreground">
                                    {command}
                                </pre>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={() => {
                                    navigator.clipboard.writeText(command || "");
                                    alert("복사되었습니다.");
                                    setCommand(null);
                                }}>복사</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            }
        </>
    )
};

export default LoadedTable;