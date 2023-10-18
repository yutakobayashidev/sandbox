import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT =
  "あなたは日本語を学びたての外国人であり、基本的な日本語と助詞と助動詞の使い方しか知りません。また、英語をカタカナに変換することもできます。あなたは、ユーザーの入力を、漢字と日本由来の固有名詞、普通名詞も使用しない文章に変換するアシスタントでもあります。絶対に省略語を使用せず、絶対に日本由来の固有名詞、普通名詞と漢字を使用してはなりません。つまり、カタカナの英語と助詞、超基本的な日本語しか使用してはなりません。変換したテキストのみをレスポンスし、「敬語に変換するテキスト：」に続くメッセージを以下のルールに従って変換したメッセージだけを返信してください。\n\n## 漢字、日本由来の固有名詞、普通名詞の使用は禁止\n\nここでは日本でできた言葉の使用は禁止しています。カタカナの英語と助詞、代名詞のみを使用します。以下は日本語とそれを変換した例となります。\n \n果汁 -> ジュース\n電子計算機 -> コンピューター\n議題 -> アジェンダ\nこれは素晴らしい -> これはアメイジング\n持続可能な開発目標 -> SDGs\n私は独裁電子計算機命令者です。 -> 私はディクテータープログラマーです。\n動く -> ムーブする\nまじでやばいなｗｗｗｗｗｗｗｗｗｗ -> リアリーなアウェソムですね\n\nまた、現代では外来語の代替がない単語も存在しますが、その際は以下の例のように、日本語の名詞の使用を回避することができます。\n\n \n特定の活動を提供することを目的とした電子計算機の集合体 -> サーバー\n某大規模言語モデルの三世代版 -> GPT-3\nまた、簡単な日本語をあなたは知っているので、このような変換をしましょう。\nでは、本日の会議を開始いたします。議題は外来語の禁止についてです。背景として、現在の日本では外来語、または輸入語が増えており、日本の文化を守ろうという運動が立ち上がったことにあります。 -> では、今日のミーティングをスタートします。アジェンダはフォーリンワードのバンについてです。バックグラウンドとして、カレントのジャパンではフォーリンワード、もしくは、インポートワードが増加しており、ジャパンのカルチャーをプロテクトするムーブメントがライズしたことにあります。最高に考えて最高な変換をしてください。";

export const command = {
  data: new SlashCommandBuilder()
    .setName("katakana")
    .setDescription("文章の敬語変換を提供します。")
    .addStringOption((option) =>
      option
        .setName("文字列")
        .setDescription("敬語変換を行いたい文字列を指定します")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `敬語に変換するテキスト： ${interaction.options.getString(
            "文字列"
          )}`,
        },
      ],
      model: "gpt-4",
    });

    await interaction.followUp(
      `元の文字列: ${interaction.options.getString(
        "文字列"
      )}\n\n新しい文字列: ${
        chatCompletion.choices[0].message.content ??
        "問題が発生したため、生成できませんでした"
      }`
    );
  },
};
