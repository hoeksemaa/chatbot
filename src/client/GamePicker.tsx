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
        <div
            className="flex flex-col items-center justify-center min-h-dvh p-8 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/assets/world_map.png)" }}
        >
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full">
                <h1 className="text-3xl font-bold mb-2 text-center">an adventure in...</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {GAMES.map((game) => (
                        <Card
                            key={game.id}
                            className="cursor-pointer hover:border-primary transition-colors overflow-hidden"
                            onClick={() => handlePick(game.id)}
                        >
                            <CardHeader>
                                <CardTitle>{game.city}</CardTitle>
                                <CardDescription>{game.year}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <Button
                        variant="outline"
                        onClick={() => authClient.signOut().then(() => { window.location.href = "/" })}
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default GamePicker
