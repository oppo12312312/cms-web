export default {
  data() {
    return {
      limitList: [
        {
          type: "img",
          size: 5 * 1024 * 1024,
          accept: ["gif", "jpg", "jpeg", "png", "zip"],
        },
        {
          type: "audio",
          size: 5 * 1024 * 1024,
          accept: ["wma", "mp3"],
        },
        {
          type: "video",
          size: 50 * 1024 * 1024,
          accept: ["avi", "mp4"],
        },
        {
          type: "file",
          size: 8 * 1024 * 1024,
          accept: ["pdf", "doc", "docx"],
        },
      ],
      limitTip:
        "上传图片大小只支持5M以内的图片，请保证图片清晰度。上传音频大小只支持5M以内的音频，音频格式支持wma,mp3。上传视频大小只支持50M以内的视频，视频格式支持avi,mp4。上传文本大小只支持8M以内的文本文件，文件格式支持pdf，word。",
    };
  },
};
