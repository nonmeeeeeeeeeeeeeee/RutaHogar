import React, { useMemo, useState } from "react";
import {
  ACADEMY_ARTICLES,
  ACADEMY_TOPICS,
  CASE_STUDIES,
  STARTER_ARTICLE_IDS,
  classifyRiskText,
  findMatchingCase,
} from "../constants/academyContent";
import GlossaryTerm, { splitTextWithGlossaryTerms } from "./GlossaryTerm";

const LEVEL_ORDER = {
  Básico: 0,
  Intermedio: 1,
  Avanzado: 2,
};

const CLASSIFICATION_CLASS = {
  Alto: "score-high",
  Medio: "score-medium",
  Bajo: "score-low",
};


// ============================================================================
// ICONO DE TEMA
// ============================================================================

function TopicIcon({ topicId }) {
  const topic = ACADEMY_TOPICS.find((t) => t.id === topicId);

  if (!topic) return null;

  return (
    <span
      className="academy-topic-icon"
      style={{
        background: `${topic.accent}1a`,
        color: topic.accent,
      }}
    >
      <i className={`ti ${topic.icon}`} />
    </span>
  );
}


// ============================================================================
// TARJETA DE ARTÍCULO
// ============================================================================

function ArticleCard({ article, onOpen }) {
  const topic = ACADEMY_TOPICS.find((t) => t.id === article.topic);

  return (
    <button
      type="button"
      className="academy-card"
      onClick={() => onOpen(article.id)}
    >
      <div className="academy-card-top">
        <TopicIcon topicId={article.topic} />

        <span className="academy-level-chip">
          {article.level}
        </span>
      </div>

      <h3>{article.title}</h3>

      <p>{article.summary}</p>

      <div className="academy-card-footer">
        <span style={{ color: topic?.accent }}>
          {topic?.label}
        </span>

        <span>
          <i className="ti ti-clock" /> {article.minutes} min
        </span>
      </div>

      {article.sources?.length > 0 && (
        <div className="academy-card-source">
          <i className="ti ti-shield-check" />

          <span>
            {article.sources.length}{" "}
            {article.sources.length === 1
              ? "fuente oficial"
              : "fuentes oficiales"}
          </span>
        </div>
      )}
    </button>
  );
}


// ============================================================================
// MODAL DE ARTÍCULO
// ============================================================================

function ArticleModal({
  article,
  onClose,
  onOpenArticle,
  related,
}) {
  if (!article) return null;

  const topic = ACADEMY_TOPICS.find(
    (t) => t.id === article.topic
  );

  return (
    <div
      className="academy-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="academy-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="academy-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <i className="ti ti-x" />
        </button>

        {/* HEADER */}

        <div className="academy-modal-header">
          <TopicIcon topicId={article.topic} />

          <div>
            <span
              className="eyebrow"
              style={{ color: topic?.accent }}
            >
              {topic?.label}
            </span>

            <h2>{article.title}</h2>
          </div>
        </div>


        {/* META */}

        <div className="academy-modal-meta">
          <span>
            <i className="ti ti-signal-3" />
            Nivel {article.level}
          </span>

          <span>
            <i className="ti ti-clock" />
            {article.minutes} min de lectura
          </span>
        </div>


        {/* CONTENIDO */}

        <div className="academy-modal-body">
          {article.body
            .split("\n\n")
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>


        {/* FUENTES OFICIALES */}

        {article.sources?.length > 0 && (
          <div className="academy-modal-sources">
            <div className="academy-modal-sources-header">
              <i className="ti ti-shield-check" />

              <div>
                <strong>Fuentes oficiales</strong>

                <p>
                  Información basada en organismos oficiales
                  chilenos.
                </p>
              </div>
            </div>

            <div className="academy-source-list">
              {article.sources.map((source, index) => (
                <a
                  key={`${source.institution}-${index}`}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="academy-source-link"
                >
                  <div className="academy-source-icon">
                    <i className="ti ti-external-link" />
                  </div>

                  <div>
                    <strong>
                      {source.institution}
                    </strong>

                    <span>
                      {source.title}
                    </span>
                  </div>

                  <i className="ti ti-chevron-right" />
                </a>
              ))}
            </div>

            {article.reviewedAt && (
              <p className="academy-reviewed">
                <i className="ti ti-calendar-check" />
                Contenido revisado: {article.reviewedAt}
              </p>
            )}
          </div>
        )}


        {/* TÉRMINOS */}

        {article.tags?.length > 0 && (
          <div className="academy-modal-terms">
            <strong>Términos relacionados</strong>

            <div className="academy-term-chips">
              {article.tags.map((tag) => (
                <GlossaryTerm
                  key={tag}
                  term={tag}
                  onOpenArticle={onOpenArticle}
                />
              ))}
            </div>
          </div>
        )}


        {/* RELACIONADOS */}

        {related.length > 0 && (
          <div className="academy-modal-related">
            <strong>Artículos relacionados</strong>

            <div className="academy-related-grid">
              {related.map((item) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  onOpen={onOpenArticle}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ============================================================================
// TAB CONCEPTOS
// ============================================================================

function ConceptosTab({ onOpenArticle }) {
  const [activeTopic, setActiveTopic] =
    useState("todos");

  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    return ACADEMY_ARTICLES
      .filter((article) => {
        const matchesTopic =
          activeTopic === "todos" ||
          article.topic === activeTopic;

        const matchesQuery =
          !normalizedQuery ||
          article.title
            .toLowerCase()
            .includes(normalizedQuery) ||
          article.summary
            .toLowerCase()
            .includes(normalizedQuery) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(normalizedQuery)
          );

        return matchesTopic && matchesQuery;
      })
      .sort(
        (a, b) =>
          LEVEL_ORDER[a.level] -
          LEVEL_ORDER[b.level]
      );
  }, [activeTopic, query]);

  return (
    <div>

      {/* INTRODUCCIÓN */}

      <div className="academy-intro">
        <div>
          <span className="eyebrow">
            Educación financiera
          </span>

          <h2>
            Aprende antes de tomar una decisión
          </h2>

          <p>
            Comprende los conceptos financieros y
            habitacionales más importantes para
            evaluar una compra de vivienda en Chile.
          </p>
        </div>

        <div className="academy-disclaimer">
          <i className="ti ti-info-circle" />

          <p>
            Este contenido tiene fines educativos.
            No constituye una aprobación de crédito,
            asesoría financiera ni confirmación de
            elegibilidad para un subsidio.
          </p>
        </div>
      </div>


      {/* FILTROS */}

      <div className="academy-toolbar">

        <div className="academy-topic-pills">

          <button
            type="button"
            className={`academy-pill ${
              activeTopic === "todos"
                ? "is-active"
                : ""
            }`}
            onClick={() => setActiveTopic("todos")}
          >
            Todos
          </button>

          {ACADEMY_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`academy-pill ${
                activeTopic === topic.id
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                setActiveTopic(topic.id)
              }
              style={
                activeTopic === topic.id
                  ? {
                      borderColor: topic.accent,
                      color: topic.accent,
                    }
                  : undefined
              }
            >
              <i className={`ti ${topic.icon}`} />

              {topic.label}
            </button>
          ))}
        </div>


        {/* BÚSQUEDA */}

        <div className="academy-search">
          <i className="ti ti-search" />

          <input
            type="text"
            placeholder="Buscar por tema, subsidio, tasa, UF..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
          />
        </div>
      </div>


      {/* ARTÍCULOS */}

      {filteredArticles.length ? (
        <div className="academy-grid">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onOpen={onOpenArticle}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>
            No encontramos artículos con ese filtro.
          </strong>

          <p>
            Prueba con otro tema o modifica la búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}


// ============================================================================
// TAB INTERPRETA TU SCORE
// ============================================================================

function InterpretaTab({
  evaluation,
  onStartEvaluation,
  onOpenArticle,
}) {
  const result = evaluation?.result;

  const risks = result?.risks || [];

  const positives =
    result?.positive_indicators || [];


  // --------------------------------------------------------------------------
  // ARTÍCULOS RECOMENDADOS
  // --------------------------------------------------------------------------

  const suggestedArticleIds = useMemo(() => {
    if (!result) return [];

    const articleIds = [];

    risks.forEach((risk) => {
      const recommendation =
        classifyRiskText(risk);

      if (
        recommendation.articleId &&
        !articleIds.includes(
          recommendation.articleId
        )
      ) {
        articleIds.push(
          recommendation.articleId
        );
      }
    });

    const finalIds =
      articleIds.length
        ? articleIds
        : STARTER_ARTICLE_IDS;

    return [...new Set(finalIds)].slice(0, 3);
  }, [result, risks]);


  // --------------------------------------------------------------------------
  // SIN EVALUACIÓN
  // --------------------------------------------------------------------------

  if (!result) {
    return (
      <div className="empty-state">
        <strong>
          Aún no tienes una preevaluación.
        </strong>

        <p>
          Completa tu preevaluación financiera para
          conocer tu score, entender los factores que
          influyen en él y recibir contenido educativo
          relevante para tu situación.
        </p>

        <button
          type="button"
          onClick={onStartEvaluation}
        >
          Ir a precalificación
        </button>
      </div>
    );
  }


  const suggestedArticles =
    suggestedArticleIds
      .map((id) =>
        ACADEMY_ARTICLES.find(
          (article) => article.id === id
        )
      )
      .filter(Boolean);


  return (
    <div>

      {/* RESULTADO */}

      <div className="academy-suggested">

        <div className="academy-suggested-header">

          <div>
            <span className="eyebrow">
              Tu resultado
            </span>

            <h3>
              {risks.length
                ? "Esto está influyendo en tu score"
                : "Tu perfil no muestra riesgos relevantes"}
            </h3>

            <p>
              {result.ai_explanation
                ? splitTextWithGlossaryTerms(
                    result.ai_explanation
                  ).map((part, i) =>
                    typeof part === "string" ? (
                      <React.Fragment key={i}>
                        {part}
                      </React.Fragment>
                    ) : (
                      <GlossaryTerm
                        key={i}
                        term={part.term}
                        onOpenArticle={
                          onOpenArticle
                        }
                      />
                    )
                  )
                : "Revisa el detalle de tu evaluación más reciente."}
            </p>
          </div>


          {/* SCORE */}

          <div
            className={`score-badge-wrap ${
              CLASSIFICATION_CLASS[
                result.classification
              ] || "score-medium"
            }`}
          >
            <span>Score actual</span>

            <strong>{result.score}</strong>

            <small>
              {result.classification}
            </small>
          </div>
        </div>


        {/* RIESGOS */}

        {risks.length > 0 && (
          <div className="academy-risk-list">

            <strong>
              Factores que deberías revisar
            </strong>

            <ul>
              {risks.map((risk, index) => {
                const recommendation =
                  classifyRiskText(risk);

                const article =
                  recommendation.articleId
                    ? ACADEMY_ARTICLES.find(
                        (item) =>
                          item.id ===
                          recommendation.articleId
                      )
                    : null;

                return (
                  <li
                    key={`${risk}-${index}`}
                  >
                    <div>
                      {recommendation.term ? (
                        splitTextWithGlossaryTerms(
                          risk
                        ).map((part, i) =>
                          typeof part ===
                          "string" ? (
                            <React.Fragment
                              key={i}
                            >
                              {part}
                            </React.Fragment>
                          ) : (
                            <GlossaryTerm
                              key={i}
                              term={part.term}
                              onOpenArticle={
                                onOpenArticle
                              }
                            />
                          )
                        )
                      ) : (
                        risk
                      )}
                    </div>

                    {article && (
                      <button
                        type="button"
                        className="academy-risk-article"
                        onClick={() =>
                          onOpenArticle(
                            article.id
                          )
                        }
                      >
                        <i className="ti ti-book-2" />

                        Aprender sobre esto

                        <i className="ti ti-arrow-right" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}


        {/* POSITIVOS */}

        {positives.length > 0 && (
          <div className="academy-positive-list">

            <strong>
              Lo que ya juega a tu favor
            </strong>

            <ul>
              {positives.map((item) => (
                <li key={item}>
                  <i className="ti ti-circle-check" />

                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* ARTÍCULOS RECOMENDADOS */}

        {suggestedArticles.length > 0 && (
          <div className="academy-recommendations">

            <div className="section-heading compact">
              <span className="eyebrow">
                Recomendado para ti
              </span>

              <h3>
                Contenido relacionado con tu evaluación
              </h3>

              <p>
                Seleccionamos estos artículos a partir
                de los factores detectados en tu
                preevaluación.
              </p>
            </div>

            <div className="academy-suggested-grid">
              {suggestedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onOpen={onOpenArticle}
                />
              ))}
            </div>
          </div>
        )}


        {/* DISCLAIMER */}

        <div className="academy-score-disclaimer">
          <i className="ti ti-info-circle" />

          <p>
            Tu score es una herramienta de
            orientación y no representa una aprobación
            de crédito. La decisión final corresponde
            a la institución financiera y depende de
            sus propios criterios de evaluación.
          </p>
        </div>

      </div>
    </div>
  );
}


// ============================================================================
// TAB CASOS PRÁCTICOS
// ============================================================================

function CasosTab({
  evaluation,
  onOpenArticle,
}) {
  const matchingCase = useMemo(
    () => findMatchingCase(evaluation),
    [evaluation]
  );

  const [openCaseId, setOpenCaseId] =
    useState(matchingCase?.id || null);


  return (
    <div>

      <div className="section-heading compact">

        <span className="eyebrow">
          Aprender con ejemplos
        </span>

        <h3>
          Casos prácticos
        </h3>

        <p>
          Situaciones ilustrativas que ayudan a
          entender por qué un determinado perfil puede
          presentar fortalezas o riesgos.
        </p>
      </div>


      {/* CASO RELACIONADO CON EL USUARIO */}

      {matchingCase && (
        <div className="academy-personal-case">

          <div className="academy-personal-case-label">
            <i className="ti ti-sparkles" />

            Caso parecido a tu situación
          </div>

          <h3>
            {matchingCase.title}
          </h3>

          <p>
            Encontramos un caso educativo con
            características similares a algunos
            factores de tu evaluación.
          </p>

          <button
            type="button"
            onClick={() =>
              setOpenCaseId(matchingCase.id)
            }
          >
            Ver caso
            <i className="ti ti-arrow-right" />
          </button>
        </div>
      )}


      {/* LISTA */}

      <div className="academy-cases">

        {CASE_STUDIES.map((item) => {
          const isOpen =
            openCaseId === item.id;

          const isMatch =
            matchingCase?.id === item.id;

          return (
            <div
              key={item.id}
              className={`academy-case ${
                isMatch ? "is-match" : ""
              }`}
            >

              <button
                type="button"
                className="academy-case-header"
                onClick={() =>
                  setOpenCaseId(
                    isOpen ? null : item.id
                  )
                }
              >
                <div>

                  {isMatch && (
                    <span className="academy-case-match">
                      Se parece a tu situación
                    </span>
                  )}

                  <strong>
                    {item.title}
                  </strong>
                </div>

                <i
                  className={`ti ${
                    isOpen
                      ? "ti-chevron-up"
                      : "ti-chevron-down"
                  }`}
                />
              </button>


              {/* CUERPO */}

              {isOpen && (
                <div className="academy-case-body">

                  <p>
                    <strong>
                      La situación:
                    </strong>{" "}
                    {item.situation}
                  </p>

                  <p>
                    <strong>
                      ¿Por qué importa?
                    </strong>{" "}
                    {item.why}
                  </p>

                  <p>
                    <strong>
                      ¿Qué conviene hacer?
                    </strong>{" "}
                    {item.action}
                  </p>


                  {/* ARTÍCULOS RELACIONADOS */}

                  {item.relatedArticleIds
                    ?.length > 0 && (
                    <div className="academy-case-links">

                      <span>
                        Aprende más:
                      </span>

                      <div>
                        {item.relatedArticleIds.map(
                          (id) => {
                            const article =
                              ACADEMY_ARTICLES.find(
                                (item) =>
                                  item.id === id
                              );

                            if (!article)
                              return null;

                            return (
                              <button
                                key={id}
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                  onOpenArticle(
                                    id
                                  )
                                }
                              >
                                {article.title}

                                <i className="ti ti-arrow-up-right" />
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>


      {/* AVISO */}

      <div className="academy-cases-disclaimer">
        <i className="ti ti-info-circle" />

        <p>
          Estos casos son ejemplos educativos y no
          representan una predicción individual ni una
          garantía de aprobación de crédito.
        </p>
      </div>

    </div>
  );
}


// ============================================================================
// TABS
// ============================================================================

const TABS = [
  {
    id: "conceptos",
    label: "Conceptos",
    icon: "ti-books",
  },
  {
    id: "interpretar",
    label: "Interpreta tu score",
    icon: "ti-chart-bar",
  },
  {
    id: "casos",
    label: "Casos prácticos",
    icon: "ti-list-details",
  },
];


// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AcademiaFinanciera({
  evaluation,
  onStartEvaluation,
  onNavigate,
}) {
  const [activeTab, setActiveTab] =
    useState("conceptos");

  const [openArticleId, setOpenArticleId] =
    useState(null);


  // --------------------------------------------------------------------------
  // ARTÍCULOS
  // --------------------------------------------------------------------------

  const openArticle = (id) => {
    setOpenArticleId(id);
  };

  const closeArticle = () => {
    setOpenArticleId(null);
  };


  const activeArticle =
    ACADEMY_ARTICLES.find(
      (article) =>
        article.id === openArticleId
    ) || null;


  // --------------------------------------------------------------------------
  // RELACIONADOS
  // --------------------------------------------------------------------------

  const relatedArticles = activeArticle
    ? ACADEMY_ARTICLES
        .filter(
          (article) =>
            article.topic ===
              activeArticle.topic &&
            article.id !== activeArticle.id
        )
        .slice(0, 2)
    : [];


  return (
    <section className="section-block academia-panel">

      {/* HEADER */}

      <div className="section-heading">

        <span className="eyebrow">
          Academia financiera
        </span>

        <h1>
          Prepárate antes de comprar
        </h1>

        <p>
          Aprende sobre crédito hipotecario, ahorro,
          endeudamiento, UF, subsidios y compra de
          vivienda con información respaldada por
          fuentes oficiales chilenas.
        </p>

      </div>


      {/* TABS */}

      <div
        className="academy-tabs"
        role="tablist"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={
              activeTab === tab.id
            }
            className={`academy-tab ${
              activeTab === tab.id
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(tab.id)
            }
          >
            <i className={`ti ${tab.icon}`} />

            {tab.label}
          </button>
        ))}
      </div>


      {/* CONTENIDO */}

      {activeTab === "conceptos" && (
        <ConceptosTab
          onOpenArticle={openArticle}
        />
      )}

      {activeTab === "interpretar" && (
        <InterpretaTab
          evaluation={evaluation}
          onStartEvaluation={
            onStartEvaluation
          }
          onOpenArticle={openArticle}
        />
      )}

      {activeTab === "casos" && (
        <CasosTab
          evaluation={evaluation}
          onOpenArticle={openArticle}
        />
      )}


      {/* MODAL */}

      <ArticleModal
        article={activeArticle}
        onClose={closeArticle}
        onOpenArticle={openArticle}
        related={relatedArticles}
      />

    </section>
  );
}