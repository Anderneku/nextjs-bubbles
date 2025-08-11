import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateBubble() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
            <CardTitle className="font-bold text-2xl">Create a Bubble</CardTitle>

            <CardDescription>Blow a New Bubble to Start Your New Community</CardDescription>
            </CardHeader>
            <CardContent>
            <form>

            </form>

            </CardContent>
        </Card>
    );
}