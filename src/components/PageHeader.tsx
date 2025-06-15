
import { SidebarTrigger } from "@/components/ui/sidebar";

type PageHeaderProps = {
    title: string;
    children?: React.ReactNode;
}

export const PageHeader = ({ title, children }: PageHeaderProps) => {
    return (
        <div className="flex items-center justify-between space-y-2 mb-4">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
            </div>
            <div className="flex items-center space-x-4">
                {children}
            </div>
        </div>
    )
}
