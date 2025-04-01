import app from './app.ts'

const port = process.env.PORT || 80

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})