/* =====================================================================
   内容数据文件 —— 你主要就编辑这个文件
   =====================================================================

   顶层是 DESTINATIONS（目的地）数组，每个目的地有自己的景点和路线，
   页面顶部会生成对应的切换标签。

   目的地字段：
     id     : 目的地英文短名（唯一）
     name   : 目的地中文名（显示在切换标签上）
     spots  : 该目的地的景点数组（字段见下）
     routes : 该目的地的路线数组（字段见下）

   ---------------------------------------------------------------------
   景点字段（spots）
   ---------------------------------------------------------------------
     id          : 景点英文短名（同一目的地内唯一）。路线里用它引用景点。
     name        : 景点中文名，显示在卡片标题。
     category    : "人文" 或 "自然"，卡片分类标签。
     effort      : 可选。体力等级 "轻松" / "适中" / "费力"，显示为彩色小标签。
     images      : 图片文件名数组（1~2 张），相对 images/ 目录。
                   龙游图在 images/longyou/，衢州图在 images/quzhou/，
                   所以写成 ["quzhou/ShuiTingMen_1.jpg", ...]。
                   没图片写 [] 会显示“暂无图片”占位图。
     conclusion  : 结论（显示在卡片最上方，重点强调）。
     background  : 背景介绍。
     ticket      : 门票 / 开放时间。
     reviews     : 真实评价，字符串数组，每条渲染成一段引用。
     showcaseOnly: 可选。true 时只展示、不进问卷、不参与路线推荐。

   ---------------------------------------------------------------------
   路线字段（routes）
   ---------------------------------------------------------------------
     id      : 路线英文短名（同一目的地内唯一）
     name    : 路线中文名
     desc    : 路线介绍 / 特点（不写具体美食店铺）
     spotIds : 这条路线包含哪些景点，写景点的 id 数组

   推荐逻辑：家人勾选景点后，系统看哪条路线包含的勾选景点最多，就把它
   排在最前面推荐，其余作为备选。你只需维护好每条路线的 spotIds。
   ===================================================================== */


const DESTINATIONS = [

  /* =================================================================
     目的地一：龙游一日自驾游
     ================================================================= */
  {
    id: "longyou",
    name: "龙游 · 一日自驾",
    spots: [
      // ---- 人文类 ----
      {
        id: "bowuguan",
        name: "龙游县博物馆",
        category: "人文",
        images: ["longyou/LongYouBoWuGuan_1.jpg", "longyou/LongYouBoWuGuan_2.jpg"],
        conclusion: "人文线第一站，1 小时足够，性价比满分。先来补知识，之后看石窟、古城更有代入感。",
        background: "系统展示龙游的地质（火山地貌）、历史与民俗，是快速了解龙游石窟之谜与地方文化的最佳起点。",
        ticket: "免费，刷身份证入馆免预约；9:00–16:00，周一闭馆。",
        reviews: [
          "馆不大但能系统了解石窟历史之谜，先来补知识，下午看石窟更有代入感。",
          "第一站先了解火山地理和人文风貌，更容易体会当地风情。"
        ]
      },
      {
        id: "juminyuan",
        name: "龙游民居苑",
        category: "人文",
        images: ["longyou/LongYouJuMinYuan_1.jpg", "longyou/LongYouJuMinYuan_2.jpg"],
        conclusion: "人文线必选，尤其适合拍照，建议预留 1–1.5 小时。",
        background: "国家 4A 级景区，集中迁建保护了 65 幢明清古建筑，展示江南传统民居艺术与龙游商帮文化，位于县城、与博物馆相邻。",
        ticket: "45–50 元（11 月至次年 3 月免票）；8:00–17:30，16:20 截止售票。",
        reviews: [
          "人少很不错，古色古香。",
          "比较出片，慢慢逛挺有味道。",
          "被多位博主列为县城内的人文核心景点。"
        ]
      },
      {
        id: "dananmen",
        name: "大南门历史文化街区",
        category: "人文",
        images: ["longyou/DaNanMen_1.jpg", "longyou/DaNanMen_2.jpg"],
        conclusion: "人文线收尾站，傍晚加夜景逛 1–1.5 小时最合适。",
        background: "龙游古城核心区，沉浸式复古街区，重现上世纪市井生活；含姑蔑古城址、可登楼看江景的“归仁门”城楼、“龙游墙”打卡点等。",
        ticket: "免费，全天可逛；夜景最佳。",
        reviews: [
          "欣赏龙游古城夜景，烟火气息浓。",
          "傍晚来正好不晒。",
          "也有人觉得店铺比较单一，丰富度不太够。"
        ]
      },
      {
        id: "zhulinchansi",
        name: "竹林禅寺",
        category: "人文",
        images: ["longyou/ZhuLinChanSi_1.jpg"],
        conclusion: "顺路打卡即可，环境清幽，适合祈福静心。",
        background: "始建于唐贞观七年（公元 632 年），主殿为“圆通宝殿”，有“十三神龟阶”的传说。",
        ticket: "免费；约 0.5 小时。",
        reviews: [
          "多为顺路安排，提及不算多。",
          "古木清幽，适合安静走走。"
        ]
      },
      {
        id: "nimeishuguan",
        name: "泥美术馆",
        category: "人文",
        images: ["longyou/NiMeiShuGuan_1.jpg", "longyou/NiMeiShuGuan_2.jpg"],
        conclusion: "本次口碑最好的免费人文点位，离县城约半小时车程，多数人认为专程跑一趟也值。建议预留 1.5 小时。",
        background: "由废弃水电站改造的乡村摄影美术馆，三层空间以乡村摄影为主题，保留老物件，三楼是带咖啡的书店，是“艺术龙游”的代表项目。",
        ticket: "免费；建议预留 1.5 小时。",
        reviews: [
          "建筑本身就很好看，展览比预想中有意思。",
          "馆长的摄影作品值得一幅幅看过去。",
          "把乡村、工业旧楼与艺术结合得很好，完全不像网红打卡点。"
        ]
      },
      {
        id: "weilaishequ",
        name: "溪口镇乡村未来社区",
        category: "人文",
        images: ["longyou/WeiLaiSheQu_1.jpg"],
        conclusion: "与泥美术馆、白马滩同线，适合顺路停留约 1 小时。",
        background: "前身是黄铁矿职工宿舍，改造为全国首个乡村版未来社区，含游乐场、文创馆、照相馆、舞美术馆和咖啡店。",
        ticket: "免费；约 1 小时。",
        reviews: [
          "理想的社区，浓浓生活气息。",
          "现代感与童年回忆结合，建设得特别好。",
          "周边都是退休老人，非常安静舒适。"
        ]
      },
      {
        // 龙游最有名的景点，保留展示但不编入路线（showcaseOnly）
        id: "shiku",
        name: "龙游石窟",
        category: "人文",
        images: ["longyou/LongYouShiKu_1.jpg", "longyou/LongYouShiKu_2.jpg"],
        conclusion: "冬季免票时值得一逛（避暑又出片），正价 85 元性价比存疑，时间紧可跳过。（供参考，未编入推荐路线）",
        background: "县城北 3 公里衢江北岸的大型古代地下洞窟群，被誉为“世界第九大奇迹”，1992 年发现，开凿年代与用途至今成谜，洞内恒温约 17℃。",
        ticket: "85 元；8:00–16:10；11 月至次年 3 月免票；停车 10 元/次。",
        reviews: [
          "夏天进去凉爽，里面很亮堂特别适合出片。",
          "每年冬天免费的时候去很值。",
          "吐槽派：10 分钟逛完，正价 85 元性价比太差。"
        ],
        showcaseOnly: true
      },

      // ---- 自然类 ----
      {
        id: "hushiguang",
        name: "瀫石光 · 95 联盟大道",
        category: "自然",
        images: ["longyou/95DaDao_1.jpg", "longyou/95DaDao_2.jpg"],
        conclusion: "自驾路线本身就是风景，自然加艺术的混合体验，强烈推荐顺路走。",
        background: "沿衢江的乡村艺术长廊，一侧是江、一侧是田野，沿途散布艺术装置与展馆，“树剧场”是核心打卡点，95 联盟大道被称为龙游最美公路之一。",
        ticket: "免费；自驾或骑行，边走边停。",
        reviews: [
          "超级适合骑车。",
          "江边好多人钓鱼露营，一路田野鸟叫虫鸣。",
          "树剧场可以待上一整天。"
        ]
      },
      {
        id: "baimatan",
        name: "白马滩",
        category: "自然",
        images: ["longyou/BaiMaTan_1.jpg", "longyou/BaiMaTan_2.jpg"],
        conclusion: "自然线核心站，适合露营、发呆、拍照，建议傍晚前往，预留 1 小时。",
        background: "灵山江畔的大片滩涂、草坪与绿道，视野开阔，被称为“微型阿勒泰”。",
        ticket: "免费；傍晚最佳。",
        reviews: [
          "下车还是很哇塞，大草坪上有天幕和帐篷。",
          "再往前走就是“小阿勒泰”，晴天更美。",
          "中午太晒、树荫少，建议傍晚来。"
        ]
      },
      {
        id: "duxiantou",
        name: "渡贤头（官潭大桥桥下）",
        category: "自然",
        images: ["longyou/DuXianTou_1.jpg", "longyou/DuXianTou_2.jpg"],
        conclusion: "亲子玩水首选，夏季约 1 小时。",
        background: "官潭大桥桥下的溪段，可以玩水、钓鱼、抓虾、捡螺蛳。",
        ticket: "免费；夏季约 1 小时。",
        reviews: [
          "桥下很凉快，可以玩水。",
          "全家老小都能玩，气温再高也不怕。"
        ]
      },
      {
        id: "shijiaocun",
        name: "石角村",
        category: "自然",
        images: ["longyou/ShiJiaoCun_1.jpg", "longyou/ShiJiaoCun_2.jpg"],
        conclusion: "自然线的小众体验点，适合傍晚慢逛。",
        background: "灵山江边的小村落，房屋围墙低矮、岁月静好；往前开还有可以溯溪的溪段。",
        ticket: "免费；约 1 小时。",
        reviews: [
          "斜阳照在村里小路，岁月静好。",
          "往前开一点，另一个村可以溯溪，超棒。",
          "几乎没什么游客。"
        ]
      },
      {
        id: "muchen",
        name: "沐尘畲族乡",
        category: "自然",
        images: ["longyou/MuChenSheZuXiang_1.jpg", "longyou/MuChenSheZuXiang_2.jpg"],
        conclusion: "适合追求安静的自驾者，预留约 1 小时。",
        background: "畲族聚居乡，溪水潺潺、村落安逸，夏季可浅滩溯溪、漂流。",
        ticket: "免费；约 1 小时。",
        reviews: [
          "微风徐徐，走在村里好安逸。",
          "溪水潺潺，整个心情都静了下来。"
        ]
      },
      {
        id: "liuchunhu",
        name: "六春湖",
        category: "自然",
        images: ["longyou/LiuChunHu_1.jpg", "longyou/LiuChunHu_2.jpg"],
        conclusion: "一日游时间偏紧，更适合两日游或早出发；前往需提前确认接驳交通。",
        background: "龙游南部的高山草甸，可看云海、竹海，山顶比山下低约 10℃，是夏日避暑核心，配套有索道/景交。",
        ticket: "免费（接驳交通另计，需提前确认价格）。",
        reviews: [
          "云端避暑观景，看云海、竹海。",
          "有人吐槽接驳交通偏贵（约五公里 80 元），出发前先确认。"
        ]
      }
    ],
    routes: [
      {
        id: "culture",
        name: "纯人文线 · 县城慢游",
        desc: "全程集中在县城，节奏轻松、走得不多，以博物馆、明清古建、复古街区和古刹为主。适合带长辈、想慢慢感受人文气息的家庭。",
        spotIds: ["bowuguan", "juminyuan", "dananmen", "zhulinchansi"]
      },
      {
        id: "nature",
        name: "纯自然线 · 灵山江山水自驾",
        desc: "以灵山江、衢江沿线的山水田园为主，视野开阔、人少清静，自驾一路都是风景。适合喜欢自然、露营、亲子玩水的家庭。",
        spotIds: ["hushiguang", "baimatan", "duxiantou", "shijiaocun", "muchen", "liuchunhu"]
      },
      {
        id: "mixed",
        name: "人文 + 自然混合线 · 宝藏精华",
        desc: "兼顾乡村艺术、现代社区改造与县城人文，覆盖本地口碑最好的点位。白天看艺术与古建，傍晚到大南门看夜景，是综合推荐。",
        spotIds: ["nimeishuguan", "weilaishequ", "bowuguan", "juminyuan", "dananmen"]
      }
    ]
  },


  /* =================================================================
     目的地二：衢州二日游（妈妈友好版，带体力等级）
     ================================================================= */
  {
    id: "quzhou",
    name: "衢州 · 二日游",
    spots: [
      // ---- 人文类（不爬山，妈妈友好） ----
      {
        id: "kongmiao",
        name: "孔氏南宗家庙",
        category: "人文",
        effort: "轻松",
        images: [], // 待补图，建议命名 quzhou/KongMiao_1.jpg
        conclusion: "衢州必去第一站，园区平坦、有树荫座椅，慢慢逛不累，预留 1–1.5 小时。",
        background: "全国仅有的两座孔氏家庙之一（另一座在曲阜），“南孔圣地”的核心，红墙古柏很出片，内有安静的后花园。",
        ticket: "10 元（检票后送 mini《论语》纪念品）；游览 1–1.5 小时。",
        reviews: [
          "安静舒服，红墙古柏很出片。",
          "里面蛮大的，还有后花园可以坐。",
          "多人把它列为衢州必去第一站。"
        ]
      },
      {
        id: "bowuguanqz",
        name: "衢州博物馆",
        category: "人文",
        effort: "轻松",
        images: ["quzhou/QuZhouBoWuGuan_1.jpg", "quzhou/QuZhouBoWuGuan_2.jpg"],
        conclusion: "全程室内空调，累了随时坐；和孔庙只隔几分钟步行，很适合中午避暑歇脚。",
        background: "免费开放，馆藏上万件文物，可看六朝青瓷、南宋文物、南孔史料，还有受小朋友欢迎的恐龙化石。",
        ticket: "免费（需预约，现场也可）；周一闭馆；1–1.5 小时。",
        reviews: [
          "室内凉快，能乘凉歇脚。",
          "靠窗位是小众出片点。"
        ]
      },
      {
        id: "ruxueguan",
        name: "中国儒学馆",
        category: "人文",
        effort: "轻松",
        images: ["quzhou/RuXueGuan_1.jpg"],
        conclusion: "室内空调、知识型慢逛，和孔庙、博物馆相邻顺路，约 1 小时。",
        background: "系统了解南孔文化的室内展馆，与孔庙、博物馆相邻。",
        ticket: "免费（参考官方）；约 1 小时。",
        reviews: [
          "室内舒适，适合了解南孔文化。"
        ]
      },
      {
        id: "shuitingmen",
        name: "水亭门历史文化街区",
        category: "人文",
        effort: "轻松",
        images: ["quzhou/ShuiTingMen_1.jpg", "quzhou/ShuiTingMen_2.jpg"],
        conclusion: "平地步行街，节奏自己掌握、边走边歇。傍晚蓝调到夜景亮灯最美，留 2–3 小时。",
        background: "衢州老城地标历史街区，含天王塔、城墙、步行街，江边城墙散步很舒服，晚上亮灯氛围感拉满。",
        ticket: "免费；傍晚 17:30 后夜景最佳。",
        reviews: [
          "夜晚的时间一定要留给水亭门。",
          "傍晚光线更好，可逛性很强。",
          "店铺偏商业化，但江边散步很值。"
        ]
      },
      {
        id: "tianwangta",
        name: "天王塔",
        category: "人文",
        effort: "轻松",
        images: ["quzhou/TianWangTa_1.jpg"],
        conclusion: "与水亭门连成一体的老城地标，夜晚亮灯漂亮，顺路打卡 15–30 分钟。",
        background: "衢州老城地标塔，与水亭门连为一体。",
        ticket: "外观免费；拍照打卡 15–30 分钟。",
        reviews: [
          "和水亭门一起逛，夜晚亮灯很好看。"
        ]
      },
      {
        id: "fushan",
        name: "府山公园",
        category: "人文",
        effort: "适中",
        images: [], // 待补图，建议命名 quzhou/FuShan_1.jpg
        conclusion: "有缓坡但整体平缓、树荫多，适合慢慢走，约 1 小时。",
        background: "老城区的“城市山林”，留存古城墙遗址、古树参天，可登高俯瞰老城，紧邻孔庙。",
        ticket: "免费；约 1 小时。",
        reviews: [
          "环境很好，慢悠悠散步很舒服。"
        ]
      },
      {
        id: "beimenjie",
        name: "北门街历史文化街区",
        category: "人文",
        effort: "适中",
        images: [], // 待补图，建议命名 quzhou/BeiMenJie_1.jpg
        conclusion: "平路慢逛，与孔庙、博物馆、水亭门顺路，饭后散步很合适，1–1.5 小时。",
        background: "老建筑保留完整的古街，夜晚灯笼亮起氛围感足。",
        ticket: "免费；1–1.5 小时。",
        reviews: [
          "古街烟火气满满，饭后散步超合适。",
          "也有人觉得没啥好逛，不去也行。"
        ]
      },
      {
        id: "luming",
        name: "鹿鸣大草坪",
        category: "人文",
        effort: "轻松",
        images: [], // 待补图，建议命名 quzhou/LuMing_1.jpg
        conclusion: "全平地，坐草坪上吹风就很治愈，还能喂小鹿，长辈孩子都喜欢，1–1.5 小时。",
        background: "一大片草坪适合拍照放空，旁边的文化院街可以喂小鹿，紧挨网红红砖“衢州礼堂”。",
        ticket: "免费；1–1.5 小时。",
        reviews: [
          "下午在大草坪拍照放空，很治愈。",
          "步行就能挨个打卡。"
        ]
      },
      {
        id: "litang",
        name: "衢州礼堂",
        category: "人文",
        effort: "轻松",
        images: [], // 待补图，建议命名 quzhou/LiTang_1.jpg
        conclusion: "纯拍照点、不费腿，拱形长廊和爱心红墙很出片，30–40 分钟。",
        background: "网红红砖建筑，拱形长廊、爱心红墙，免费无需预约。",
        ticket: "免费；30–40 分钟。",
        reviews: [
          "红砖建筑出片率高。"
        ]
      },
      {
        id: "doutan",
        name: "斗潭茶馆",
        category: "人文",
        effort: "轻松",
        images: [], // 待补图，建议命名 quzhou/DouTan_1.jpg
        conclusion: "本次最“妈妈友好”的场所——坐下喝茶聊天完全不用走路，适合下午茶或雨天备选。",
        background: "临斗潭公园荷塘的老牌茶馆，竹椅木桌，5 元清茶无限续杯，有川剧变脸、老电影放映，本地人扎堆。",
        ticket: "清茶约 5 元/位，无限续杯；建议坐 2 小时。",
        reviews: [
          "松弛感天花板。",
          "台风天宅坐一下午的快乐源泉。"
        ]
      },
      {
        // 距市区远、二日游时间紧不建议专程，保留展示但不编入路线
        id: "nianbadu",
        name: "廿八都古镇",
        category: "人文",
        effort: "适中",
        images: ["quzhou/NianBaDuGuZhen_1.jpg", "quzhou/NianBaDuGuZhen_2.jpg"],
        conclusion: "平路慢逛的千年古镇，但距市区车程 1.5–2 小时，二日游时间紧不建议专程；喜欢古镇可单独安排。（供参考，未编入推荐路线）",
        background: "浙闽赣三省交界的千年古镇，融合丹霞地貌、古建民居与民俗文化，素有“来江山必到”之说。",
        ticket: "80 元/人（2026 年 3–6 月有免费时段；早 8 点前 / 下午 5 点后进景区不收费，供参考）。",
        reviews: [
          "作为衢州经典人文古镇，适合喜欢古镇的人。"
        ],
        showcaseOnly: true
      },

      // ---- 自然 / 山野类 ----
      {
        id: "yaowangshan",
        name: "药王山",
        category: "自然",
        effort: "适中",
        images: ["quzhou/YaoWangShan_1.jpg", "quzhou/YaoWangShan_2.jpg"],
        conclusion: "轻徒步加玩水可行，但别买含玻璃栈道的套票；玩到八卦泉、马尾瀑折返即可，先爬山后玩水避免着凉。",
        background: "紫薇山森林公园的一部分，主打溯溪玩水、看野生猕猴和瀑布，夏天比市区低 5–7℃。",
        ticket: "65 元（线上更优惠）；建议 08:30–16:30；玻璃天桥/滑道等为自费项目。",
        reviews: [
          "八卦泉可以踩冰凉山泉水、捞小鱼。",
          "马尾瀑水雾清凉、拍照出片。",
          "不常运动别买套票，石梯道蛮陡。"
        ]
      },
      {
        id: "tianjilongmen",
        name: "天脊龙门",
        category: "自然",
        effort: "费力",
        images: ["quzhou/TianJiLongMen_1.jpg", "quzhou/TianJiLongMen_2.jpg"],
        conclusion: "台阶较多、消耗体力；膝盖不好建议放弃或只走前半段，可选滑索/滑道下山省力。",
        background: "与药王山同属紫薇山森林公园，主打悬崖栈道、索桥、峡谷飞瀑，经典环线含飞天索桥和 1800 米悬空栈道。",
        ticket: "65 元；全程约 3–3.5 小时，台阶较多。",
        reviews: [
          "飞天索桥俯瞰峡谷，氛围感拉满。",
          "悬空栈道贴在崖壁，山风清凉。"
        ]
      },
      {
        id: "jianglangshan",
        name: "江郎山",
        category: "自然",
        effort: "费力",
        images: [], // 待补图，建议命名 quzhou/JiangLangShan_1.jpg
        conclusion: "台阶陡、体力消耗大，不建议长辈硬爬；可乘观光车/索道到观景平台看三爿石，只走平缓段、不登顶。",
        background: "国家级重点风景名胜区、4A，以“三爿石”奇峰著称，被称为“神州丹霞第一峰”，位于江山市，距市区车程 1 小时以上。",
        ticket: "大门票旺季约 100 元、淡季约 60 元（工作日 A 级免大门票）；索道/观光车另计；建议留大半天。",
        reviews: [
          "早 7–9 点上山舒服，台阶陡，恐高走侧边平缓步道。",
          "防滑鞋一定要穿，山里蚊虫多。"
        ]
      },
      {
        id: "xianxiahu",
        name: "仙霞湖",
        category: "自然",
        effort: "适中",
        images: ["quzhou/XianXiaHu_1.jpg", "quzhou/XianXiaHu_2.jpg"],
        conclusion: "以车游观景为主，湖光山色很出片；但山路弯道多，晕车的长辈慎选。",
        background: "衢州近郊的水库湖泊，湖光山色，举村观景台在山路上。",
        ticket: "免费（车游）；车程约 1 小时。",
        reviews: [
          "开车 1 小时，真的很美。",
          "山路弯道多、不好开，晕车慎选。"
        ]
      }
    ],
    routes: [
      {
        id: "hiking",
        name: "路线 A · 爬山线（体力型）",
        desc: "两天一夜，Day1 逛市区人文与老城夜景，Day2 登山避暑（江郎山，或药王山＋天脊龙门）。适合体力好、想登山避暑的组合；长辈可同行但只走平缓段。",
        spotIds: ["kongmiao", "bowuguanqz", "shuitingmen", "tianwangta", "jianglangshan", "yaowangshan", "tianjilongmen", "xianxiahu"]
      },
      {
        id: "easy",
        name: "路线 B · 不爬山线（妈妈首选）",
        desc: "两天一夜，全程几乎不爬坡、景点密集、可随时休息。Day1 南孔文化加老城夜景，Day2 草坪放空、红砖打卡、茶馆慢坐。适合长辈同行、亲子和想彻底放松的家庭。",
        spotIds: ["kongmiao", "bowuguanqz", "ruxueguan", "fushan", "shuitingmen", "tianwangta", "beimenjie", "luming", "litang", "doutan"]
      }
    ]
  }

];
