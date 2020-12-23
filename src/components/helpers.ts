import { Camera } from 'expo-camera';

export async function getAskCameraPermission() {
    const { status } = await Camera.getPermissionsAsync();
    if (status === 'granted') {
        return true;
    } else {
        const requestStatus = await Camera.requestPermissionsAsync();
        if (requestStatus.status === 'granted') {
            return true;
        } else {
            return false;
        }
    }
}
