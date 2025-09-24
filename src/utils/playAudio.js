import ErrorToast from "../components/toasts/error-toast";
import WarningToast from "../components/toasts/warning-toast";
import { baseUrl } from "../config/config";
import axiosInstance from "../interceptors";

export const playAudioHandler = async (text, language, audioRef) => {
	if (!text) {
		WarningToast("Please type a question first");
		return;
	}

	try {
		const { data } = await axiosInstance.post(
			`${baseUrl}/job-posting/tts/get-audio`,
			{
				text,
				language,
			}
		);
		if (data.success || data.status) {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.load();
			}
			const timestamp = Date.now();
			audioRef.current.src = `${data.audioLink}?t=${timestamp}`;
			await audioRef.current.play();
		}
	} catch (error) {
		ErrorToast(error.message || "Could not get the audio");
	}
};
