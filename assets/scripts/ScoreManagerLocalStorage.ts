
interface UserLoginStatus {
    userLogin: boolean;
}

interface UserData {
    gameData: number[][];
    userLoginStatus: UserLoginStatus;
}

interface UserDatabase {
    [username: string]: UserData;
}





export function setUserData(userData: UserDatabase) 
{
    localStorage.setItem('userData', JSON.stringify(userData));
}

export function getUserData(): UserDatabase 
{
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : {};
}

export function updateScore(username: string, gameModeIndex: number, levelIndex: number, newScore: number) 
{
    const userData = getUserData();

    if (!userData[username]) userData[username] = { gameData: [], userLoginStatus: { userLogin: false } };

    const gameData = userData[username].gameData;

    if (!gameData[gameModeIndex]) gameData[gameModeIndex] = [];

    gameData[gameModeIndex][levelIndex] = newScore;

    setUserData(userData);
}

export function getUserGameData(username: string): number[][] | null
{
    const userData = getUserData();
    return userData[username]?.gameData || null;
}

export function setUserLoginStatus(username: string, loginStatus: boolean) {
    const userData = getUserData();
    if (userData[username]) 
    {
        userData[username].userLoginStatus = { userLogin: loginStatus };
        setUserData(userData);
    }
}

export function getUserLoginStatus(username: string): boolean | undefined 
{
    const userData = getUserData();
    return userData[username]?.userLoginStatus?.userLogin;
}





















