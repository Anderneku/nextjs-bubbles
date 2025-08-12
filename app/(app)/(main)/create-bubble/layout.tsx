export default function CreateBubbleLayout({children}: {children: React.ReactNode}) {
    return (
        <main className="w-screen h-fit p-8 flex justify-center items-center">
            {children}
        </main>
    );
}