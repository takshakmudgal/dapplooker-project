import app from './app';
import { CONFIG } from './config/env.config';

const PORT = CONFIG.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
