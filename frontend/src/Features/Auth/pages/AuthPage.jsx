import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import "./auth.css";

const CarteloLogo = ({ className = "h-8" }) => (
  <svg viewBox="0 0 320 48" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(-11.0, -11.0) scale(0.033)">
      {/* Path 1: Main Body */}
      <path fill="#f5c518" d="M 1010 578.031 C 957.847 582.949, 915.837 593.520, 871.694 612.832 C 857.543 619.023, 831.806 632.468, 822 638.791 C 783.861 663.385, 767.034 676.866, 736.932 706.947 C 711.024 732.836, 698.302 748.437, 678.177 779 C 668.432 793.799, 654.122 819.314, 649.013 831 C 647.450 834.575, 643.960 842.450, 641.256 848.500 C 631.655 869.986, 620.290 906.343, 614.997 932.500 C 593.609 1038.198, 609.440 1145.677, 659.911 1237.435 C 681.661 1276.978, 706.468 1309.719, 739.908 1343.017 C 777.574 1380.522, 813.704 1405.944, 862 1428.923 C 906.770 1450.225, 949.920 1462.658, 1000 1468.685 C 1018.226 1470.878, 1070.288 1471.168, 1088.500 1469.177 C 1185.288 1458.595, 1270.393 1419.987, 1336.878 1356.500 C 1348.481 1345.420, 1382.332 1306.717, 1385.420 1301 C 1385.866 1300.175, 1383.622 1302.425, 1380.433 1306 C 1352.637 1337.166, 1315.001 1365.585, 1276.500 1384.478 C 1226.117 1409.203, 1173.221 1420.101, 1118.855 1416.959 C 1071.939 1414.247, 1018.442 1397.492, 978.584 1373.028 C 947.377 1353.874, 924.887 1335.532, 900.633 1309.456 C 848.758 1253.683, 818.514 1193.668, 802.555 1114.837 C 794.915 1077.094, 793.591 1063.872, 793.565 1025 C 793.545 995.945, 793.842 989.178, 795.804 974 C 808.738 873.923, 847.672 791.614, 910.786 730.920 C 950.029 693.183, 991.436 669.207, 1037.500 657.549 C 1072.630 648.659, 1105.787 650.708, 1151.695 664.607 C 1176.034 671.975, 1207.924 687.327, 1232.927 703.711 C 1246.868 712.846, 1267.303 727.945, 1273.519 733.703 C 1275.180 735.242, 1280.932 740.494, 1286.301 745.377 C 1309.299 766.287, 1334.643 798.395, 1352.701 829.500 C 1356.533 836.100, 1360.086 841.423, 1360.597 841.329 C 1361.107 841.235, 1374.888 834.764, 1391.220 826.949 L 1420.915 812.740 1415.377 802.120 C 1404.793 781.826, 1387.225 755.893, 1369.567 734.500 C 1357.036 719.318, 1327.007 689.264, 1312 676.885 C 1284.356 654.081, 1264.310 640.619, 1234.288 624.693 C 1189.185 600.768, 1139.935 585.644, 1086.978 579.456 C 1071.099 577.600, 1023.845 576.726, 1010 578.031" />
      {/* Path 2 */}
      <path fill="#262525ff" d="M 879.500 684.097 C 808.494 722.765, 759.961 770.450, 722.486 838.366 C 696.318 885.791, 681.106 936.329, 675.903 993.127 C 674.225 1011.449, 675.300 1055.656, 677.885 1074.571 C 686.166 1135.187, 705.791 1187.008, 739.369 1236.931 C 757.614 1264.058, 773.571 1282.895, 794.438 1301.944 C 812.533 1318.461, 824.610 1327.751, 849 1343.917 C 867.215 1355.991, 889.131 1368.746, 881.728 1362.966 C 856.566 1343.319, 835.478 1322.998, 816.500 1300.109 C 770.585 1244.731, 739.616 1178.446, 726.512 1107.500 C 720.448 1074.669, 719.548 1064.216, 719.541 1026.500 C 719.533 988.667, 720.263 979.474, 725.978 945.500 C 734.025 897.666, 752.871 846.590, 777.819 805 C 796.524 773.816, 814.489 750.663, 840.958 723.623 C 859.236 704.951, 871.969 693.370, 884.163 684.325 C 891.864 678.612, 893.788 676.973, 892.750 677.009 C 892.612 677.013, 886.650 680.203, 879.500 684.097" />
      {/* Path 3 */}
      <path fill="#f5c518" d="M 1020.885 695.895 C 1006.460 700.638, 982.560 712.676, 967.387 722.840 C 932.505 746.207, 902.686 777.872, 877.304 818.500 C 872.370 826.399, 857 855.295, 857 856.674 C 857 857.065, 861.837 852.647, 867.750 846.856 C 903.609 811.736, 950.445 785.775, 993.519 777.144 C 1012.991 773.242, 1021.109 772.510, 1044 772.593 C 1069.061 772.684, 1084.058 774.549, 1104.372 780.104 C 1165.478 796.813, 1212.119 831.260, 1246.018 884.722 C 1249.583 890.344, 1252.844 894.956, 1253.264 894.972 C 1253.925 894.996, 1318.873 864.204, 1319.870 863.394 C 1320.519 862.866, 1312.979 848.987, 1305.464 836.876 C 1268.705 777.643, 1205.888 729.255, 1139 708.651 C 1106.787 698.728, 1088.964 696.057, 1051 695.464 C 1035.875 695.228, 1022.323 695.422, 1020.885 695.895" />
      {/* Path 4 */}
      <path fill="#ffffff" d="M 1247.882 1163.726 C 1221.894 1203.328, 1183.589 1237.060, 1145.334 1254.031 C 1119.148 1265.648, 1105.208 1269.880, 1079.662 1273.970 C 1026.395 1282.498, 969.657 1271.387, 921.637 1243.024 C 905.061 1233.233, 882.022 1215.021, 864.163 1197.589 L 853.825 1187.500 862.408 1204.730 C 877.025 1234.073, 889.360 1252.948, 909.966 1277.500 C 929.750 1301.074, 960.737 1328.132, 984.172 1342.298 C 995.908 1349.393, 995.252 1349.221, 1019.411 1351.500 C 1074.689 1356.712, 1125.049 1348.132, 1174.928 1325.001 C 1222.393 1302.990, 1265.346 1267.434, 1295.736 1225 C 1302.027 1216.216, 1318.577 1190.267, 1319.617 1187.557 C 1320.075 1186.362, 1312.946 1182.472, 1287.460 1170.011 C 1269.450 1161.205, 1254.613 1154, 1254.489 1154 C 1254.365 1154, 1251.392 1158.377, 1247.882 1163.726" />
      {/* Path 5 */}
      <path fill="#ffffff" d="M 1354.259 1217.369 C 1340.572 1241.368, 1321.897 1265.815, 1300.004 1288.396 C 1255.916 1333.869, 1208.146 1363.937, 1146.500 1385.019 C 1140.450 1387.088, 1134.600 1389.012, 1133.500 1389.294 C 1130.074 1390.175, 1169.059 1389.806, 1177.500 1388.877 C 1188.206 1387.700, 1215.034 1383.237, 1222.500 1381.391 C 1225.800 1380.575, 1235.475 1377.621, 1244 1374.827 C 1308.730 1353.610, 1364.040 1315.375, 1405.840 1262.950 C 1412.887 1254.112, 1422.440 1238.026, 1421.294 1236.927 C 1420.139 1235.820, 1362.152 1207, 1361.079 1207 C 1360.581 1207, 1357.512 1211.666, 1354.259 1217.369" />
    </g>
    {/* Embedded HTML typography for animation support inside SVG */}
    <foreignObject x="64" y="0" width="250" height="48">
      <div 
        className="w-full h-full flex items-center"
        style={{ 
          color: "#ffffff", 
          fontFamily: "Manrope, sans-serif", 
          fontWeight: "800", 
          fontSize: "30px", 
          letterSpacing: "0.18em"
        }}
      >
        <BrandMark />
      </div>
    </foreignObject>
  </svg>
);

/* ── Animated CARTELO wordmark ──────────────────────────────── */
function BrandMark() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(
        "span",
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.9, ease: "expo.out", delay: 0.3 }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="brand-letters overflow-hidden flex">
      {"CARTELO".split("").map((l, i) => (
        <span key={i} className="inline-block">{l}</span>
      ))}
    </div>
  );
}

/* ── Left editorial panel ───────────────────────────────────── */
function EditorialPanel() {
  const panelRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".panel-line",
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.8, ease: "expo.out", delay: 0.6 }
      );
    }, panelRef);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={panelRef}
      className="hidden lg:flex flex-col justify-between w-[45%] h-full bg-[#111111] bg-cover bg-center text-[#f0f0f0] relative overflow-hidden flex-shrink-0"
      style={{ backgroundImage: "url('/auth_model.png')" }}
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Top: brand */}
      <div className="relative z-10 p-12">
        <div className="brand-logo mb-2">
          <CarteloLogo className="h-14" />
        </div>
        <p className="panel-line text-[0.6875rem] font-semibold uppercase tracking-[0.25em] text-[#f5c518] mt-4" style={{ fontFamily: "Inter" }}>
          Buy · Sell · Discover
        </p>
      </div>

      {/* Center: headline */}
      <div className="relative z-10 px-12 pb-4">
        <h2
          className="panel-line text-5xl xl:text-6xl font-bold leading-[1.0] text-[#f0f0f0] mb-6"
          style={{ fontFamily: "Manrope" }}
        >
          Shop the world.<br />Sell yours.
        </h2>
        <p className="panel-line text-sm text-[#888] max-w-xs leading-relaxed" style={{ fontFamily: "Inter" }}>
          Cartelo is the marketplace where millions of buyers meet sellers. List a product or discover your next purchase — all in one place.
        </p>
      </div>

      {/* Bottom: features + status */}
      <div className="relative z-10 px-12 pb-12 space-y-6">
        {/* Divider */}
        <div className="panel-line h-px bg-white/10 w-16" />

        <div className="space-y-3">
          {[
            { label: "Millions of products across categories" },
            { label: "Secure checkout & buyer protection" },
            { label: "Seller dashboard with live analytics" },
            { label: "Fast delivery, easy returns" },
          ].map((item) => (
            <div key={item.label} className="panel-line flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-[#f5c518]" />
              <span className="text-xs text-[#888]" style={{ fontFamily: "Inter" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="panel-line flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[0.6875rem] text-[#555] uppercase tracking-widest" style={{ fontFamily: "Inter" }}>
            System operational
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Tabs ───────────────────────────────────────────────────── */
function AuthTabs({ tab, setTab }) {
  return (
    <div className="flex gap-8 mb-6 border-b border-[#222]">
      {[
        { id: "login", label: "Sign In" },
        { id: "register", label: "Create Account" },
      ].map((t) => (
        <button
          key={t.id}
          id={`tab-${t.id}`}
          role="tab"
          aria-selected={tab === t.id}
          onClick={() => setTab(t.id)}
          className="relative pb-4 text-sm font-medium transition-colors duration-200"
          style={{
            fontFamily: "Inter",
            color: tab === t.id ? "#f0f0f0" : "#666",
          }}
        >
          {t.label}
          {tab === t.id && (
            <motion.div
              className="tab-underline"
              layoutId="tab-indicator"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const formWrapRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        formWrapRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: 0.4 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d0d0d]">
      {/* Left — editorial */}
      <EditorialPanel />

      {/* Right — form */}
      <div className="flex-1 flex flex-col h-full bg-[#0d0d0d]">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[#222]">
          {/* Increase h-8 to h-10 if you want mobile top bar logo bigger! */}
          <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#666]" style={{ fontFamily: "Inter" }}>
            AW'24
          </span>
        </div>

        {/* Centered form area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar flex items-start lg:items-center justify-center px-6 sm:px-10 py-8 lg:py-10">
          <div ref={formWrapRef} className="w-full max-w-sm sm:max-w-md">

          {/* Tabs */}
          <AuthTabs tab={tab} setTab={setTab} />

          {/* Animated form area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "login" ? (
                <LoginForm onSwitch={() => setTab("register")} />
              ) : (
                <RegisterForm onSwitch={() => setTab("login")} />
              )}
            </motion.div>
          </AnimatePresence>

            {/* Footer copy */}
            <p className="mt-8 text-sm text-[#555] text-center" style={{ fontFamily: "Inter" }}>
              © 2024 Cartelo International S.A.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
