import os
import tkinter as tk
from tkinter import messagebox, scrolledtext
from google import genai
from google.genai import types
import wave

# 初始化 Gemini Client
# 建議將 API Key 設定在環境變數中，或直接填入下方的引號內
API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")

def save_wave_file(filename, pcm_data, channels=1, rate=24000, sample_width=2):
    """將 Gemini 回傳的原始 PCM 資料轉存為 WAV 檔"""
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_data)

def generate_audio():
    # 取得使用者輸入的文字
    prompt_text = text_input.get("1.0", tk.END).strip()
    if not prompt_text:
        messagebox.showwarning("警告", "請輸入對話內容！")
        return

    # 停用按鈕，顯示處理中狀態
    btn_generate.config(state=tk.DISABLED, text="語音生成中，請稍候...")
    root.update()

    try:
        client = genai.Client(api_key="AIzaSyByBaCM0Krh-xpahz8i9B0nYkDmZ8p87NM")
        
        # 建立系統提示，明確指示 AI 這是多角色的語音任務
        system_instruction = (
            "You are a multilingual TTS generator. Convert the following dialogue into spoken audio. "
            "Maintain the languages specified in the text (it can be Chinese, English, Japanese, or Korean). "
            "Use appropriate prebuilt voices for different speakers to make it sound like a natural conversation."
        )

        # 呼叫 Gemini 2.0 模型 (支援多模態音訊輸出與多語言)
        response = client.models.generate_content(
            model="gemini-3.1-flash-tts-preview", 
            contents=f"{system_instruction}\n\nDialogue:\n{prompt_text}",
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                        speaker_voice_configs=[
                            types.SpeakerVoiceConfig(
                                speaker='Joe',
                                voice_config=types.VoiceConfig(
                                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name='Kore')
                                )
                            ),
                            types.SpeakerVoiceConfig(
                                speaker='Jane',
                                voice_config=types.VoiceConfig(
                                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name='Puck')
                                )
                            ),
                        ]
                    )
                )
            )
        )

        # 尋找並提取音訊資料
        audio_part = None
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data and "audio" in part.inline_data.mime_type:
                    audio_part = part
                    break

        if audio_part:
            raw_audio_data = audio_part.inline_data.data
            output_filename = 'output_dialogue.wav'
            
            # Gemini 2.0 預設通常為 24000 Hz
            save_wave_file(output_filename, raw_audio_data, rate=24000)
            
            messagebox.showinfo("成功", f"語音檔案生成成功！\n已儲存為：{output_filename}")
        else:
            # 如果沒有收到音訊，顯示文字回應（可能包含錯誤訊息）
            err_msg = response.text if response.text else "未收到音訊回應。"
            messagebox.showerror("錯誤", f"未能生成語音。文字回應：\n{err_msg}")

    except Exception as e:
        messagebox.showerror("系統錯誤", f"發生非預期錯誤：\n{str(e)}")
    
    finally:
        # 恢復按鈕狀態
        btn_generate.config(state=tk.NORMAL, text="開始生成語音 (.wav)")

# --- GUI 介面佈局 ---
root = tk.Tk()
root.title("Gemini 多國語音對話生成器")
root.geometry("600x500")
root.resizable(True, True)

# 標題標籤
lbl_title = tk.Label(root, text="請輸入多語言對話內容：", font=("Arial", 12, "bold"))
lbl_title.pack(anchor="w", padx=20, pady=(15, 5))

# 預設範例文字（中、英、日、韓混合對話）
default_text = """Joe: Hello Jane! Long time no see.
Jane: こんにちは、Joeさん！最近忙しいですか？
Joe: 一點點。对了，너 요즘 어떻게 지내? (你最近過得怎樣？)
Jane: 잘 지내고 있어요! Everything is going great!"""

# 滾動文字輸入框
text_input = scrolledtext.ScrolledText(root, font=("Microsoft JhengHei", 11), wrap=tk.WORD)
text_input.pack(fill=tk.BOTH, expand=True, padx=20, pady=5)
text_input.insert(tk.END, default_text)

# 提示說明
lbl_hint = tk.Label(
    root, 
    text="💡 提示：請確保角色名稱（如 Joe:, Jane:）與設定一致。支援中/英/日/韓文直接混合。",
    fg="gray", font=("Arial", 9)
)
lbl_hint.pack(anchor="w", padx=20, pady=5)

# 生成按鈕
btn_generate = tk.Button(
    root, 
    text="開始生成語音 (.wav)", 
    command=generate_audio, 
    bg="#4CAF50", 
    fg="white", 
    font=("Arial", 11, "bold"),
    pady=8
)
btn_generate.pack(fill=tk.X, padx=20, pady=20)

# 執行主迴圈
root.mainloop()