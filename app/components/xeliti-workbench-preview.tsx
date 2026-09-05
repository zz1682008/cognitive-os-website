import Image from "next/image";

type ProductScreenProps = {
  name: string;
  alt: string;
  priority?: boolean;
};

export function ProductScreen({ name, alt, priority = false }: ProductScreenProps) {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={`/xeliti-${name}-v1-mobile.webp`} />
      <Image
        src={`/xeliti-${name}-v1.webp`}
        alt={alt}
        width={1600}
        height={name === "service" ? 1067 : 1001}
        unoptimized
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}

const workbenches = [
  {
    id: "company-folders", name: "folder", label: "企业文件夹",
    title: <>资料放进来，<br className="mobile-break" />工作用起来。</>,
    alt: "V1.0 设计示意：企业文件夹按财务、销售、法务等归档，相关资料与原文、版本依据在同一个工作区内可见。",
    focus: "52% 46%", note: "企业自己的资料，连起每一项工作。",
  },
  {
    id: "workbench", name: "finance", label: "财务工作台",
    title: <>想要的报表，<br className="mobile-break" />一句话生成。</>,
    alt: "V1.0 设计示意：输入帮我生成本月财务报表，中间直接出现收入、支出、结余、图表和报表草稿，右侧保留资料依据。所有金额为示例数据。",
    focus: "56% 48%", note: "从一句需求，到一份可核对的报表。",
  },
  {
    id: "legal-workbench", name: "legal", label: "法务工作台",
    title: <>合同有问题，<br className="mobile-break" />直接标出来。</>,
    alt: "V1.0 设计示意：采购合同上的付款条件、违约责任和合同期限被直接标注，右侧列出待核对事项，提示人工复核。",
    focus: "69% 43%", note: "哪条要留意，回到原文就看得见。",
  },
];

export function XelitiWorkbenchPreview() {
  return workbenches.map((workbench) => (
    <section className={`product-chapter chapter-${workbench.name}`} id={workbench.id} key={workbench.id} aria-labelledby={`${workbench.id}-title`} data-product-chapter>
      <div className="chapter-stage">
        <div className="chapter-heading page-width">
          <p className="module-label">{workbench.label}</p>
          <h2 id={`${workbench.id}-title`}>{workbench.title}</h2>
        </div>
        <figure className="product-figure page-width">
          <div className="screen-window">
            <div className="screen-art" data-screen-art style={{ transformOrigin: workbench.focus }}>
              <ProductScreen name={workbench.name} alt={workbench.alt} />
            </div>
          </div>
          <figcaption>{workbench.note}</figcaption>
        </figure>
      </div>
    </section>
  ));
}
