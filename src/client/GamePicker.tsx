import { useNavigate, Navigate } from "react-router"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { postCreateGame } from "./lib/chatClient"
import { authClient } from "./lib/authClient"
import { GAMES } from "@/server/games"

function GamePicker() {
    const { data: session, isPending } = authClient.useSession()
    const navigate = useNavigate()

    const handlePick = async (gameId: string) => {
        const conversation = await postCreateGame(gameId)
        navigate(`/conversation/${conversation.id}`)
    }

    if (isPending) return <div>Loading...</div>
    if (!session) return <Navigate to="/" replace />

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Adventure</h1>
            <p className="text-muted-foreground mb-8">Pick a city. Survive the story.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                {GAMES.map((game) => (
                    <Card
                        key={game.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handlePick(game.id)}
                    >
                        <CardHeader>
                            <CardTitle>{game.city}</CardTitle>
                            <CardDescription>{game.year}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
            <Button
                variant="outline"
                className="mt-8"
                onClick={() => authClient.signOut().then(() => { window.location.href = "/" })}
            >
                Sign Out
            </Button>
        </div>
    )
}

export default GamePicker
