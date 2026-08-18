export type Lang = "en" | "ja" | "ko";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
];

export interface Dict {
  meta: { title: string; subtitle: string };
  nav: { langLabel: string };
  intro: {
    heading: string;
    body: string;
    formula: string;
    formulaCaption: string;
  };
  form: {
    heading: string;
    startFrom: string;
    metric: {
      concurrent: string;
      tps: string;
      rps: string;
      pageviews: string;
    };
    metricHint: {
      concurrent: string;
      tps: string;
      rps: string;
      pageviews: string;
    };
    capacityLabel: {
      concurrent: string;
      tps: string;
      rps: string;
      pageviews: string;
    };
    timeBasis: string;
    perSec: string;
    perMin: string;
    perUserMode: string;
    perUserDirect: string;
    perUserBehavior: string;
    perUserRateLabel: {
      tps: string;
      rps: string;
      pageviews: string;
    };
    actionsPerClick: {
      tps: string;
      rps: string;
      pageviews: string;
    };
    thinkTime: string;
    thinkTimeHint: string;
    derivedRate: string;
    secShort: string;
    stayTime: string;
    stayTimeHint: string;
    utilization: string;
    utilizationHint: string;
    reset: string;
    metricCompare: string;
  };
  steps: {
    heading: string;
    caption: string;
    concurrentStart: string;
    perUser: string;
    s1title: string;
    s1formula: string;
    s2title: string;
    s2formula: string;
    s3title: string;
    s3formula: string;
    resultLabel: string;
    meansLabel: string;
    reverseFormula: string;
    s1means: (users: string, perUser: string, unit: string, load: string) => string;
    s2means: (
      users: string,
      load: string,
      unit: string,
      utilPct: string,
      headroomPct: string
    ) => string;
  };
  results: {
    heading: string;
    concurrentCapacity: string;
    concurrentCapacityHint: string;
    recommendedOutflow: string;
    recommendedOutflowUnit: string;
    recommendedOutflowHint: string;
    theoreticalOutflow: string;
    perSecond: string;
    targetConcurrency: string;
    steadyThroughput: string;
    usersUnit: string;
    formulaLine: string;
    invalid: string;
  };
  chart: {
    heading: string;
    caption: string;
    yAxis: string;
    xAxis: string;
    minuteShort: string;
    legendFill: string;
    legendSteady: string;
    legendCapacity: string;
    legendTarget: string;
    transitionNote: (minute: number) => string;
  };
  table: {
    heading: string;
    minute: string;
    admitted: string;
    leaving: string;
    active: string;
    capacityUsed: string;
    cohortLeaves: string;
    phaseFill: string;
    phaseSteady: string;
  };
  insight: {
    heading: string;
    body: string;
    dontDump: string;
  };
  footer: {
    note: string;
  };
}

const en: Dict = {
  meta: {
    title: "Queue-it Max Outflow Explainer",
    subtitle:
      "How Queue-it converts your site's capacity into a safe users-per-minute release rate — with a live minute-by-minute view.",
  },
  nav: { langLabel: "Language" },
  intro: {
    heading: "The idea in one line",
    body:
      "Your site can safely hold a maximum number of concurrent active users. Each admitted user stays for an average time, then leaves. Queue-it releases users at a steady rate so that, in balance, the number leaving matches the number entering — keeping the site full but never overloaded.",
    formula: "Max Outflow (users/min) = Concurrent capacity ÷ Average stay time",
    formulaCaption:
      "This is Little's Law (L = λ × W) rearranged: the release rate λ that keeps concurrency at L when each user stays W minutes.",
  },
  form: {
    heading: "Your numbers",
    startFrom: "Start from",
    metric: {
      concurrent: "Concurrent users",
      tps: "TPS",
      rps: "RPS",
      pageviews: "Page views",
    },
    metricHint: {
      concurrent: "You already know your concurrent-user capacity.",
      tps: "Transactions per second the backend can sustain.",
      rps: "HTTP/API requests per second the backend can sustain.",
      pageviews: "Page views your site can serve.",
    },
    capacityLabel: {
      concurrent: "Concurrent user capacity",
      tps: "Backend capacity (TPS)",
      rps: "Backend capacity (RPS)",
      pageviews: "Backend capacity (page views)",
    },
    timeBasis: "Time basis",
    perSec: "per second",
    perMin: "per minute",
    perUserMode: "Traffic per active user",
    perUserDirect: "Enter rate directly",
    perUserBehavior: "Estimate from behavior",
    perUserRateLabel: {
      tps: "TPS generated per active user",
      rps: "RPS generated per active user",
      pageviews: "Page views generated per active user",
    },
    actionsPerClick: {
      tps: "Transactions per click",
      rps: "Requests per page / click",
      pageviews: "Page views per click",
    },
    thinkTime: "Think time between clicks (seconds)",
    thinkTimeHint:
      "Average seconds a user waits between actions. One action every N seconds → rate = actions ÷ N.",
    derivedRate: "Each active user ≈",
    secShort: "s",
    stayTime: "Average stay time / journey (minutes)",
    stayTimeHint: "How long an admitted user stays active on the site (W).",
    utilization: "Target utilization (%)",
    utilizationHint:
      "Safety margin. 80% leaves 20% headroom for spikes, retries and expensive requests.",
    reset: "Reset to example",
    metricCompare:
      "Granularity differs: one user generates the most RPS, fewer page views, and the fewest TPS. RPS = every HTTP/API request. Page views = page loads. TPS = completed business transactions (checkout, login). Pick the one that is your real bottleneck.",
  },
  steps: {
    heading: "How this number is calculated",
    caption:
      "Every input is turned into concurrent users the site can hold, then into a per-minute release rate. Follow the numbers step by step.",
    concurrentStart:
      "You started from concurrent users, so no conversion is needed — we use your capacity directly.",
    perUser: "user",
    s1title: "Convert capacity into concurrent users the site can hold",
    s1formula: "Concurrent users = Capacity ÷ Traffic per active user",
    s2title: "Apply the safety margin (target utilization)",
    s2formula: "Target concurrency = Concurrent users × Utilization",
    s3title: "Little's Law → users admitted per minute",
    s3formula: "Max Outflow = Target concurrency ÷ Average stay time",
    resultLabel: "Result",
    meansLabel: "What this means",
    reverseFormula: "Expected load = Concurrent users × Traffic per active user",
    s1means: (users, perUser, unit, load) =>
      `At ${perUser} ${unit} per active user, about ${users} concurrent users would generate ${load} ${unit} — reaching the site's stated capacity.`,
    s2means: (users, load, unit, utilPct, headroomPct) =>
      `At ${utilPct}% target utilization, about ${users} active users would generate ${load} ${unit}, leaving roughly ${headroomPct}% headroom.`,
  },
  results: {
    heading: "Result",
    concurrentCapacity: "Concurrent capacity (L)",
    concurrentCapacityHint: "Active users the site can hold at once.",
    recommendedOutflow: "Recommended Max Outflow",
    recommendedOutflowUnit: "users / minute",
    recommendedOutflowHint: "Set this in Queue-it as the outflow per minute.",
    theoreticalOutflow: "Theoretical ceiling",
    perSecond: "Per second",
    targetConcurrency: "Steady-state concurrency",
    steadyThroughput: "Steady-state throughput",
    usersUnit: "users",
    formulaLine: "Formula",
    invalid: "Enter positive values to see the result.",
  },
  chart: {
    heading: "Active users, minute by minute",
    caption:
      "Users ramp up while the site fills, then flatten into steady state once the first cohort's stay time elapses.",
    yAxis: "Active users",
    xAxis: "Minutes since opening",
    minuteShort: "min",
    legendFill: "Filling (ramp-up)",
    legendSteady: "Steady state",
    legendCapacity: "Full capacity",
    legendTarget: "Target concurrency",
    transitionNote: (m) =>
      `At minute ${m} the first cohort leaves — from here, entering ≈ leaving.`,
  },
  table: {
    heading: "Minute-by-minute detail",
    minute: "Minute",
    admitted: "Admitted",
    leaving: "Leaving",
    active: "Active users",
    capacityUsed: "Capacity used",
    cohortLeaves: "first cohort leaves",
    phaseFill: "Filling",
    phaseSteady: "Steady state",
  },
  insight: {
    heading: "Why a rate, not one big release",
    body:
      "It is tempting to read '1,000 concurrent capacity' as 'release 1,000 users at once.' That creates a spike that overshoots capacity, then a sawtooth of surges and gaps as cohorts leave together.",
    dontDump:
      "Releasing at a steady rate instead produces a smooth ramp to a stable plateau — new arrivals simply replace users who finish.",
  },
  footer: {
    note:
      "Educational tool. The recommended outflow is only as good as your two key inputs: throughput per active user and average journey minutes. Measure both, then the calculation is deterministic.",
  },
};

const ja: Dict = {
  meta: {
    title: "Queue-it 最大アウトフロー解説ツール",
    subtitle:
      "サイトのキャパシティを、安全な「1分あたりの入場者数」に変換する仕組みを、分単位のグラフで解説します。",
  },
  nav: { langLabel: "言語" },
  intro: {
    heading: "ひとことで言うと",
    body:
      "サイトが同時に安全に収容できる最大アクティブユーザー数には上限があります。入場した各ユーザーは平均滞在時間だけ利用し、その後退出します。Queue-it は一定のペースでユーザーを入場させることで、退出数と入場数を釣り合わせ、サイトを満杯に保ちながら過負荷を防ぎます。",
    formula: "最大アウトフロー（人/分）＝ 同時接続キャパシティ ÷ 平均滞在時間",
    formulaCaption:
      "これはリトルの法則（L = λ × W）の変形です。各ユーザーが W 分滞在するとき、同時接続数を L に保つ入場レート λ を求めます。",
  },
  form: {
    heading: "入力値",
    startFrom: "起点となる指標",
    metric: {
      concurrent: "同時接続ユーザー",
      tps: "TPS",
      rps: "RPS",
      pageviews: "ページビュー",
    },
    metricHint: {
      concurrent: "同時接続ユーザーのキャパシティが既に分かっている場合。",
      tps: "バックエンドが処理できる1秒あたりのトランザクション数。",
      rps: "バックエンドが処理できる1秒あたりのHTTP/APIリクエスト数。",
      pageviews: "サイトが処理できるページビュー数。",
    },
    capacityLabel: {
      concurrent: "同時接続ユーザーのキャパシティ",
      tps: "バックエンドのキャパシティ（TPS）",
      rps: "バックエンドのキャパシティ（RPS）",
      pageviews: "バックエンドのキャパシティ（ページビュー）",
    },
    timeBasis: "時間の単位",
    perSec: "秒あたり",
    perMin: "分あたり",
    perUserMode: "アクティブユーザー1人あたりのトラフィック",
    perUserDirect: "レートを直接入力",
    perUserBehavior: "行動から推定",
    perUserRateLabel: {
      tps: "ユーザー1人あたりのTPS",
      rps: "ユーザー1人あたりのRPS",
      pageviews: "ユーザー1人あたりのページビュー",
    },
    actionsPerClick: {
      tps: "1クリックあたりのトランザクション数",
      rps: "1ページ/クリックあたりのリクエスト数",
      pageviews: "1クリックあたりのページビュー数",
    },
    thinkTime: "クリック間の思考時間（秒）",
    thinkTimeHint:
      "ユーザーが次の操作までに待つ平均秒数。N秒ごとに1操作 → レート ＝ 操作数 ÷ N。",
    derivedRate: "アクティブユーザー1人あたり ≈",
    secShort: "秒",
    stayTime: "平均滞在時間 / 導線（分）",
    stayTimeHint: "入場したユーザーがサイトで利用し続ける時間（W）。",
    utilization: "目標稼働率（%）",
    utilizationHint:
      "安全マージン。80%にすると、スパイクや再試行、重いリクエストのために20%の余裕を残せます。",
    reset: "例に戻す",
    metricCompare:
      "粒度が異なります。1人のユーザーが生む数は RPS が最も多く、ページビュー、TPS の順に少なくなります。RPS＝すべての HTTP/API リクエスト。ページビュー＝ページ表示回数。TPS＝完了した業務トランザクション（決済・ログインなど）。実際のボトルネックとなる単位を選んでください。",
  },
  steps: {
    heading: "この数字が出るまでの計算",
    caption:
      "どの入力値も、まずサイトがさばける同時接続ユーザー数に変換し、次に1分あたりの入場レートに変換します。数値を順番に追ってください。",
    concurrentStart:
      "同時接続ユーザーから始めているため、変換は不要です。入力したキャパシティをそのまま使います。",
    perUser: "人",
    s1title: "キャパシティをサイトがさばける同時接続ユーザー数に変換",
    s1formula: "同時接続ユーザー ＝ キャパシティ ÷ 1人あたりのトラフィック",
    s2title: "安全マージン（目標稼働率）を適用",
    s2formula: "目標同時接続数 ＝ 同時接続ユーザー × 目標稼働率",
    s3title: "リトルの法則 → 1分あたりの入場数",
    s3formula: "最大アウトフロー ＝ 目標同時接続数 ÷ 平均滞在時間",
    resultLabel: "結果",
    meansLabel: "これは何を意味するか",
    reverseFormula: "想定負荷 ＝ 同時接続ユーザー × 1人あたりのトラフィック",
    s1means: (users, perUser, unit, load) =>
      `アクティブユーザー1人あたり ${perUser} ${unit} の場合、約 ${users} 人の同時接続ユーザーで ${load} ${unit} となり、サイトの上限キャパシティに達します。`,
    s2means: (users, load, unit, utilPct, headroomPct) =>
      `目標稼働率 ${utilPct}% では、約 ${users} 人のアクティブユーザーで約 ${load} ${unit} となり、約 ${headroomPct}% の余裕を残します。`,
  },
  results: {
    heading: "計算結果",
    concurrentCapacity: "同時接続キャパシティ（L）",
    concurrentCapacityHint: "サイトが同時に収容できるアクティブユーザー数。",
    recommendedOutflow: "推奨 最大アウトフロー",
    recommendedOutflowUnit: "人 / 分",
    recommendedOutflowHint: "この値を Queue-it の「1分あたりのアウトフロー」に設定します。",
    theoreticalOutflow: "理論上の上限",
    perSecond: "秒あたり",
    targetConcurrency: "定常状態の同時接続数",
    steadyThroughput: "定常状態のスループット",
    usersUnit: "人",
    formulaLine: "計算式",
    invalid: "正の値を入力すると結果が表示されます。",
  },
  chart: {
    heading: "アクティブユーザー数の推移（分単位）",
    caption:
      "サイトが埋まる間はユーザー数が増加し、最初の集団の滞在時間が経過すると定常状態で横ばいになります。",
    yAxis: "アクティブユーザー",
    xAxis: "開場からの経過（分）",
    minuteShort: "分",
    legendFill: "充填中（立ち上がり）",
    legendSteady: "定常状態",
    legendCapacity: "満杯キャパシティ",
    legendTarget: "目標同時接続数",
    transitionNote: (m) =>
      `${m}分の時点で最初の集団が退出 — ここから、入場 ≒ 退出 になります。`,
  },
  table: {
    heading: "分単位の詳細",
    minute: "分",
    admitted: "入場",
    leaving: "退出",
    active: "アクティブ",
    capacityUsed: "使用率",
    cohortLeaves: "最初の集団が退出",
    phaseFill: "充填中",
    phaseSteady: "定常状態",
  },
  insight: {
    heading: "なぜ一括ではなく「レート」なのか",
    body:
      "「同時接続1,000」を「一度に1,000人入場させる」と解釈したくなります。しかしそれはキャパシティを超えるスパイクを生み、集団が一斉に退出することでノコギリ状の増減を繰り返します。",
    dontDump:
      "一定のレートで入場させると、なめらかに立ち上がって安定した水準に達します。新しい入場者が、利用を終えたユーザーを置き換えるだけになります。",
  },
  footer: {
    note:
      "教育用ツールです。推奨アウトフローの精度は、2つの重要な入力値（アクティブユーザー1人あたりのスループットと平均導線分数）次第です。両方を測定すれば、計算は一意に定まります。",
  },
};

const ko: Dict = {
  meta: {
    title: "Queue-it 최대 아웃플로우 설명 도구",
    subtitle:
      "사이트의 처리 용량을 안전한 '분당 입장 인원'으로 변환하는 원리를 분 단위 그래프로 설명합니다.",
  },
  nav: { langLabel: "언어" },
  intro: {
    heading: "한 줄 요약",
    body:
      "사이트가 동시에 안전하게 수용할 수 있는 최대 동시 접속 사용자 수에는 상한이 있습니다. 입장한 각 사용자는 평균 체류 시간 동안 이용한 뒤 떠납니다. Queue-it은 일정한 속도로 사용자를 입장시켜 나가는 인원과 들어오는 인원의 균형을 맞추고, 사이트를 가득 채우면서도 과부하를 방지합니다.",
    formula: "최대 아웃플로우(명/분) = 동시 접속 용량 ÷ 평균 체류 시간",
    formulaCaption:
      "이것은 리틀의 법칙(L = λ × W)을 변형한 것입니다. 각 사용자가 W분 머무를 때 동시 접속을 L로 유지하는 입장 속도 λ를 구합니다.",
  },
  form: {
    heading: "입력값",
    startFrom: "시작 기준",
    metric: {
      concurrent: "동시 접속 사용자",
      tps: "TPS",
      rps: "RPS",
      pageviews: "페이지뷰",
    },
    metricHint: {
      concurrent: "동시 접속 사용자 용량을 이미 알고 있는 경우.",
      tps: "백엔드가 처리할 수 있는 초당 트랜잭션 수.",
      rps: "백엔드가 처리할 수 있는 초당 HTTP/API 요청 수.",
      pageviews: "사이트가 처리할 수 있는 페이지뷰 수.",
    },
    capacityLabel: {
      concurrent: "동시 접속 사용자 용량",
      tps: "백엔드 용량 (TPS)",
      rps: "백엔드 용량 (RPS)",
      pageviews: "백엔드 용량 (페이지뷰)",
    },
    timeBasis: "시간 단위",
    perSec: "초당",
    perMin: "분당",
    perUserMode: "활성 사용자 1명당 트래픽",
    perUserDirect: "속도 직접 입력",
    perUserBehavior: "행동으로 추정",
    perUserRateLabel: {
      tps: "사용자 1명당 TPS",
      rps: "사용자 1명당 RPS",
      pageviews: "사용자 1명당 페이지뷰",
    },
    actionsPerClick: {
      tps: "클릭당 트랜잭션 수",
      rps: "페이지/클릭당 요청 수",
      pageviews: "클릭당 페이지뷰 수",
    },
    thinkTime: "클릭 사이의 생각 시간(초)",
    thinkTimeHint:
      "사용자가 다음 동작까지 기다리는 평균 초. N초마다 1회 동작 → 속도 = 동작 수 ÷ N.",
    derivedRate: "활성 사용자 1명당 ≈",
    secShort: "초",
    stayTime: "평균 체류 시간 / 여정(분)",
    stayTimeHint: "입장한 사용자가 사이트에서 활동을 유지하는 시간(W).",
    utilization: "목표 사용률(%)",
    utilizationHint:
      "안전 여유. 80%로 설정하면 스파이크, 재시도, 무거운 요청을 위해 20%의 여유를 남깁니다.",
    reset: "예시로 되돌리기",
    metricCompare:
      "세분성이 다릅니다. 사용자 1명이 만드는 양은 RPS가 가장 많고, 페이지뷰, TPS 순으로 적어집니다. RPS = 모든 HTTP/API 요청. 페이지뷰 = 페이지 로드 횟수. TPS = 완료된 업무 트랜잭션(결제·로그인 등). 실제 병목이 되는 단위를 선택하세요.",
  },
  steps: {
    heading: "이 숫자가 나오기까지의 계산",
    caption:
      "모든 입력값은 먼저 사이트가 수용할 수 있는 동시 접속 사용자 수로 변환되고, 다음으로 분당 입장 속도로 변환됩니다. 숫자를 단계별로 따라가 보세요.",
    concurrentStart:
      "동시 접속 사용자에서 시작했으므로 변환이 필요 없습니다. 입력한 용량을 그대로 사용합니다.",
    perUser: "명",
    s1title: "용량을 사이트가 수용할 수 있는 동시 접속 사용자 수로 변환",
    s1formula: "동시 접속 사용자 = 용량 ÷ 사용자 1명당 트래픽",
    s2title: "안전 여유(목표 사용률) 적용",
    s2formula: "목표 동시 접속 수 = 동시 접속 사용자 × 목표 사용률",
    s3title: "리틀의 법칙 → 분당 입장 인원",
    s3formula: "최대 아웃플로우 = 목표 동시 접속 수 ÷ 평균 체류 시간",
    resultLabel: "결과",
    meansLabel: "이것이 의미하는 바",
    reverseFormula: "예상 부하 = 동시 접속 사용자 × 사용자 1명당 트래픽",
    s1means: (users, perUser, unit, load) =>
      `활성 사용자 1명당 ${perUser} ${unit}일 때, 약 ${users}명의 동시 접속 사용자가 ${load} ${unit}를 생성하여 사이트의 명시된 용량에 도달합니다.`,
    s2means: (users, load, unit, utilPct, headroomPct) =>
      `목표 사용률 ${utilPct}%에서는 약 ${users}명의 활성 사용자가 약 ${load} ${unit}를 생성하며, 약 ${headroomPct}%의 여유를 남깁니다.`,
  },
  results: {
    heading: "계산 결과",
    concurrentCapacity: "동시 접속 용량 (L)",
    concurrentCapacityHint: "사이트가 동시에 수용할 수 있는 활성 사용자 수.",
    recommendedOutflow: "권장 최대 아웃플로우",
    recommendedOutflowUnit: "명 / 분",
    recommendedOutflowHint: "이 값을 Queue-it의 분당 아웃플로우로 설정하세요.",
    theoreticalOutflow: "이론적 상한",
    perSecond: "초당",
    targetConcurrency: "정상 상태 동시 접속 수",
    steadyThroughput: "정상 상태 처리량",
    usersUnit: "명",
    formulaLine: "계산식",
    invalid: "양수 값을 입력하면 결과가 표시됩니다.",
  },
  chart: {
    heading: "활성 사용자 수 추이(분 단위)",
    caption:
      "사이트가 채워지는 동안 사용자 수가 증가하고, 첫 번째 그룹의 체류 시간이 지나면 정상 상태로 평평해집니다.",
    yAxis: "활성 사용자",
    xAxis: "오픈 후 경과(분)",
    minuteShort: "분",
    legendFill: "채우는 중(상승)",
    legendSteady: "정상 상태",
    legendCapacity: "최대 용량",
    legendTarget: "목표 동시 접속 수",
    transitionNote: (m) =>
      `${m}분 시점에 첫 그룹이 떠납니다 — 이후부터는 입장 ≒ 퇴장.`,
  },
  table: {
    heading: "분 단위 상세",
    minute: "분",
    admitted: "입장",
    leaving: "퇴장",
    active: "활성 사용자",
    capacityUsed: "사용률",
    cohortLeaves: "첫 그룹 퇴장",
    phaseFill: "채우는 중",
    phaseSteady: "정상 상태",
  },
  insight: {
    heading: "왜 한 번에 대량 방출이 아니라 '속도'인가",
    body:
      "'동시 접속 1,000'을 '한 번에 1,000명 입장'으로 해석하기 쉽습니다. 그러나 이는 용량을 초과하는 스파이크를 만들고, 그룹이 한꺼번에 빠져나가면서 톱니 모양의 급등과 공백을 반복하게 됩니다.",
    dontDump:
      "일정한 속도로 입장시키면 부드럽게 상승해 안정적인 수준에 도달합니다. 새 입장자는 이용을 마친 사용자를 대체할 뿐입니다.",
  },
  footer: {
    note:
      "교육용 도구입니다. 권장 아웃플로우의 정확도는 두 가지 핵심 입력값, 즉 활성 사용자 1명당 처리량과 평균 여정 분수에 달려 있습니다. 둘 다 측정하면 계산은 확정적입니다.",
  },
};

export const DICTS: Record<Lang, Dict> = { en, ja, ko };

export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? en;
}
