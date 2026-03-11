import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";



export default function PLPSkeleton() {
    return (
        <Card className="w-full max-w-xs">
            <CardHeader>
                <Skeleton className="aspect-video w-full" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-8 w-3/3" />
                <div className="flex gap-6">
                    <Skeleton className="h-10 w-2/3" />
                    <Skeleton className="h-9 w-10 rounded-full" />
                    <Skeleton className="h-9 w-10 rounded-full" />
                </div>
            </CardContent>
        </Card>
    )
}