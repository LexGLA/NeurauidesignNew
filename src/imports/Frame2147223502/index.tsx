import svgPaths from "./svg-65xube4j68";
import { imgGroup } from "./svg-h6w4h";

function Group() {
  return (
    <div className="absolute inset-[-15.34%_-19.52%_-20.3%_-19.19%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[5.605px_10.682px] mask-size-[21.865px_11.188px]" style={{ maskImage: `url("${imgGroup}")` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.2886 32.5551">
        <g id="Group">
          <path d={svgPaths.p1749b300} fill="url(#paint0_linear_3021_7924)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3021_7924" x1="27.9097" x2="1.09645" y1="5.34011" y2="7.37479">
            <stop stopColor="#BD40FF" />
            <stop offset="0.461538" stopColor="#893FF8" />
            <stop offset="0.788462" stopColor="#7B62FC" />
            <stop offset="1" stopColor="#382693" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[29.17%_4.72%_24.22%_4.17%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute contents inset-[29.17%_4.72%_24.22%_4.17%]" data-name="Layer_1">
      <ClipPathGroup />
    </div>
  );
}

function Frame() {
  return (
    <div className="col-1 ml-0 mt-0 overflow-clip relative row-1 size-[24px]">
      <Layer />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex gap-[3px] items-center left-[calc(50%+137.5px)] top-0">
      <p className="[word-break:break-word] font-['Neogrey_Medium:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] whitespace-nowrap" dir="auto">
        Neura
      </p>
      <Group1 />
    </div>
  );
}

function Group2() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%+137.5px)] top-0">
      <Frame1 />
    </div>
  );
}

function Setting() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="setting-2">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="setting-2">
          <path d={svgPaths.p11e36480} fill="var(--fill-0, #404040)" id="Vector" />
          <path d={svgPaths.p38fb4100} fill="var(--fill-0, #404040)" id="Vector_2" />
          <path d="M20 0H0V20H20V0Z" fill="var(--fill-0, #404040)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineSetting() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="vuesax/outline/setting-2">
      <Setting />
    </div>
  );
}

function VuesaxOutlineNotification() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/notification">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="notification">
          <path d={svgPaths.pd605480} fill="var(--fill-0, #404040)" id="Vector" />
          <path d={svgPaths.pf572b80} fill="var(--fill-0, #404040)" id="Vector_2" />
          <path d={svgPaths.p4c02580} fill="var(--fill-0, #404040)" id="Vector_3" />
          <g id="Vector_4" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineSearchNormal() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/search-normal">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="search-normal">
          <path d={svgPaths.pff77930} fill="var(--fill-0, #404040)" id="Vector" />
          <path d={svgPaths.p2215e000} fill="var(--fill-0, #404040)" id="Vector_2" />
          <g id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center left-0 top-[3px]">
      <VuesaxOutlineSetting />
      <div className="relative shrink-0 size-[20px]" data-name="notification">
        <VuesaxOutlineNotification />
      </div>
      <div className="relative shrink-0 size-[20px]" data-name="search-normal">
        <VuesaxOutlineSearchNormal />
      </div>
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="relative size-full">
      <Group2 />
      <Frame3 />
    </div>
  );
}