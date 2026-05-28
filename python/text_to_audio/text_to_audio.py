import os
import tkinter as tk
from tkinter import messagebox, scrolledtext
from google import genai
from google.genai import types
import wave

# 初始化 Gemini Client
API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")

def save_combined_wave(filename, pcm_data_list, channels=1, rate=24000, sample_width=2):
    """將多段 PCM 資料按順序合併，並儲存為單一 WAV 檔案"""
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        # 將所有片段的 bytes 拼接在一起寫入
        combined_data = b"".join(pcm_data_list)
        wf.writeframes(combined_data)

def generate_audio():

    prompt_text = text_input.get("1.0", tk.END).strip()
    if not prompt_text:
        messagebox.showwarning("警告", "請輸入對話內容！")
        return

    btn_generate.config(state=tk.DISABLED, text="多角色語音分批生成中...")
    root.update()

    # 定義每種標籤對應的專屬聲音名稱
    voice_mapping = {
        "CH": "Aoede",   # 中文女聲
        "EN": "Kore",    # 英文男聲
        "JP": "Puck",    # 日文女聲
        "KR": "Fenrir"   # 韓文男聲
    }

    try:
        client = genai.Client(api_key="AIzaSyByBaCM0Krh-xpahz8i9B0nYkDmZ8p87NM")
        pcm_segments = [] # 用來存放每一行生成的音訊資料

        # 將輸入文字逐行拆解處理
        lines = prompt_text.split('\n')
        
        for index, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue # 跳過空白行
            
            # 檢查這一行是由哪個標籤開頭
            matched_tag = None
            for tag in voice_mapping.keys():
                if line.startswith(f"{tag}:") or line.startswith(f"{tag}："):
                    matched_tag = tag
                    break
            
            # 如果這行沒有標準標籤，就跳過或當作預設處理
            if not matched_tag:
                print(f"跳過無法識別標籤的行: {line}")
                continue
            
            voice_name = voice_mapping[matched_tag]
            print(f"正在生成第 {index+1} 行 ({matched_tag} 語音)...")
            
            system_instruction = f"You are a professional TTS generator. Read the following text naturally using the designated voice."

# 單獨為這一行請求語音（塞入一個 Dummy 角色湊滿 2 個，繞過 API 限制）
            response = client.models.generate_content(
                model="gemini-3.1-flash-tts-preview", 
                contents=f"{system_instruction}\n\nText:\n{line}",
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                            speaker_voice_configs=[
                                # 第一個：這一行真正要發音的角色
                                types.SpeakerVoiceConfig(
                                    speaker=matched_tag,
                                    voice_config=types.VoiceConfig(
                                        prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice_name)
                                    )
                                ),
                                # 第二個：用來湊人數的 Dummy 角色（文字裡沒有 Dummy:，所以它不會出聲）
                                types.SpeakerVoiceConfig(
                                    speaker='Dummy',
                                    voice_config=types.VoiceConfig(
                                        prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name='Puck')
                                    )
                                )
                            ]
                        )
                    )
                )
            )
            # 提取音訊二進位資料
            audio_part = None
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if part.inline_data and "audio" in part.inline_data.mime_type:
                        audio_part = part
                        break

            if audio_part:
                pcm_segments.append(audio_part.inline_data.data)
            else:
                print(f"警告：第 {index+1} 行未成功生成音訊。")

        # 檢查是否有成功生成任何片段
        if pcm_segments:
            output_filename = 'multilingual_combined.wav'
            # 合併所有片段並存檔
            save_combined_wave(output_filename, pcm_segments, rate=24000)
            messagebox.showinfo("成功", f"4種專屬人聲已成功分離生成並合併！\n已儲存為：{output_filename}")
        else:
            messagebox.showerror("錯誤", "未能生成任何有效的語音片段。")

    except Exception as e:
        messagebox.showerror("系統錯誤", f"發生錯誤：\n{str(e)}")
    
    finally:
        btn_generate.config(state=tk.NORMAL, text="開始生成語音 (.wav)")

# --- GUI 介面佈局 ---
root = tk.Tk()
root.title("Gemini 4國語言專屬人聲語音生成器 (方案B)")
root.geometry("600x520")
root.resizable(True, True)

lbl_title = tk.Label(root, text="請輸入對話（每行一個語言標籤，將各自獨立發音）：", font=("Arial", 11, "bold"))
lbl_title.pack(anchor="w", padx=20, pady=(15, 5))

# 預設測試文字
default_text = """CH: 技術進步正在加速全球化。
EN: Tech progress is accelerating globalization.
JP: 技術の進歩がグローバル化を加速させている。
KR: 기술의 진보가 세계화를 가속화하고 있다."""

text_input = scrolledtext.ScrolledText(root, font=("Microsoft JhengHei", 11), wrap=tk.WORD)
text_input.pack(fill=tk.BOTH, expand=True, padx=20, pady=5)
text_input.insert(tk.END, default_text)

lbl_hint = tk.Label(
    root, 
    text="💡 運作原理：程式會自動將各行拆開送給 Gemini，並為中、英、日、韓指派 4 個不同的人聲，最後完美拼接！",
    fg="green", font=("Arial", 9)
)
lbl_hint.pack(anchor="w", padx=20, pady=5)

btn_generate = tk.Button(
    root, 
    text="開始生成語音 (.wav)", 
    command=generate_audio, 
    bg="#28A745", 
    fg="white", 
    font=("Arial", 11, "bold"),
    pady=8
)
btn_generate.pack(fill=tk.X, padx=20, pady=20)

root.mainloop()