import React, { useMemo, useState } from "react";
import {
  ACADEMY_ARTICLES,
  ACADEMY_TOPICS,
  MOCK_USER_CONTEXT,
} from "../constants/academyContent";
import GlossaryTerm, { splitTextWithGlossaryTerms } from "./GlossaryTerm";

const LEVEL_ORDER = { Básico: 0, Intermedio: 1, Avanzado: 2 };

function TopicIcon({ topicId }) {
  const topic = ACADEMY_TOPICS.find((t) => t.id === topicId);
  if (!topic) return null;
  return (
    <span className="academy-topic-icon" style={{ background: `${topic.accent}1a`, color: topic.accent }}>
      <i className={`ti ${topic.icon}`} />
    </span>
  );
}

function ArticleCard({ article, onOpen }) {
  const topic = ACADEMY_TOPICS.find((t) => t.id === article.topic);
  return (
    <button type="button" className="academy-card" onClick={() => onOpen(article.id)}>
      <div className="academy-card-top">
        <TopicIcon topicId={article.topic} />
        <span className="academy-level-chip">{article.level}</span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      <div className="academy-card-footer">
        <span style={{ color: topic?.accent }}>{topic?.label}</span>
        <span><i className="ti ti-clock" /> {article.minutes} min</span>
      </div>
    </button>
  );
}

function ArticleModal({ article, onClose, onOpenArticle, related }) {
  if (!article) return null;
  const topic = ACADEMY_TOPICS.find((t) => t.id === article.topic);

  return (
    <div className="academy-modal-backdrop" onClick={onClose}>
      <div className="academy-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="academy-modal-close" onClick={onClose} aria-label="Cerrar">
          <i className="ti ti-x" />
        </button>

        <div className="academy-modal-header">
          <TopicIcon topicId={article.topic} />
          <div>
            <span className="eyebrow" style={{ color: topic?.accent }}>{topic?.label}</span>
            <h2>{article.title}</h2>
          </div>
        </div>

        <div className="academy-modal-meta">
          <span><i className="ti ti-signal-3" /> Nivel {article.level}</span>
          <span><i className="ti ti-clock" /> {article.minutes} min de lectura</span>
        </div>

        <div className="academy-modal-body">
          {article.body.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {article.tags?.length > 0 && (
          <div className="academy-modal-terms">
            <strong>Términos relacionados</strong>
            <div className="academy-term-chips">
              {article.tags.map((tag) => (
                <GlossaryTerm key={tag} term={tag} onOpenArticle={onOpenArticle} />
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="academy-modal-related">
            <strong>Artículos relacionados</strong>
            <div className="academy-related-grid">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} onOpen={onOpenArticle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcademiaFinanciera({ evaluation, onNavigate }) {
  const [activeTopic, setActiveTopic] = useState("todos");
  const [query, setQuery] = useState("");
  const [openArticleId, setOpenArticleId] = useState(null);

  // HU12 - E2: usa el bloqueador financiero real si viene por props;
  // si no hay evaluación disponible, se simula con datos de prueba.
  const userContext = evaluation?.mainBlocker ? evaluation : MOCK_USER_CONTEXT;

  const suggestedArticles = useMemo(
    () =>
      userContext.recommendedArticleIds
        .map((id) => ACADEMY_ARTICLES.find((a) => a.id === id))
        .filter(Boolean),
    [userContext]
  );

  const filteredArticles = useMemo(() => {
    return ACADEMY_ARTICLES.filter((article) => {
      const matchesTopic = activeTopic === "todos" || article.topic === activeTopic;
      const matchesQuery =
        !query.trim() ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesTopic && matchesQuery;
    }).sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  }, [activeTopic, query]);

  const openArticle = (id) => setOpenArticleId(id);
  const closeArticle = () => setOpenArticleId(null);

  const activeArticle = ACADEMY_ARTICLES.find((a) => a.id === openArticleId) || null;
  const relatedArticles = activeArticle
    ? ACADEMY_ARTICLES.filter((a) => a.topic === activeArticle.topic && a.id !== activeArticle.id).slice(0, 2)
    : [];

  return (
    <section className="section-block academia-panel">
      <div className="section-heading">
        <span className="eyebrow">Academia financiera</span>
        <h1>Prepárate antes de comprar</h1>
        <p>Cápsulas breves sobre crédito hipotecario, pie, subsidios, tasas y tipos de vivienda, pensadas para quien está dando sus primeros pasos.</p>
      </div>

      {/* HU12 - E2: contenido sugerido según el bloqueador financiero del lead */}
      <div className="academy-suggested">
        <div className="academy-suggested-header">
          <div>
            <span className="eyebrow">Sugerido para ti</span>
            <h3>Tu bloqueador principal: {userContext.blockerLabel}</h3>
            <p>{userContext.blockerDetail}</p>
          </div>
          <div className={`score-badge-wrap ${userContext.classification === "Alto" ? "score-high" : userContext.classification === "Medio" ? "score-medium" : "score-low"}`}>
            <span>Score actual</span>
            <strong>{userContext.score}</strong>
            <small>{userContext.classification}</small>
          </div>
        </div>
        <div className="academy-suggested-grid">
          {suggestedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onOpen={openArticle} />
          ))}
        </div>
      </div>

      {/* HU12 - E1: catálogo educativo organizado por tema */}
      <div className="academy-toolbar">
        <div className="academy-topic-pills">
          <button
            type="button"
            className={`academy-pill ${activeTopic === "todos" ? "is-active" : ""}`}
            onClick={() => setActiveTopic("todos")}
          >
            Todos
          </button>
          {ACADEMY_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`academy-pill ${activeTopic === topic.id ? "is-active" : ""}`}
              onClick={() => setActiveTopic(topic.id)}
              style={activeTopic === topic.id ? { borderColor: topic.accent, color: topic.accent } : undefined}
            >
              <i className={`ti ${topic.icon}`} /> {topic.label}
            </button>
          ))}
        </div>
        <div className="academy-search">
          <i className="ti ti-search" />
          <input
            type="text"
            placeholder="Buscar por tema, ej: subsidio, tasa, plazo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredArticles.length ? (
        <div className="academy-grid">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onOpen={openArticle} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>No encontramos artículos con ese filtro.</strong>
          <p>Prueba con otro tema o borra la búsqueda.</p>
        </div>
      )}

      {/* HU12 - E3: demostración de enlaces contextuales dentro de otras pantallas */}
      <div className="academy-context-demo">
        <span className="eyebrow">Vista previa contextual</span>
        <h3>Así se vería dentro de Resultado o Plan de mejora</h3>
        <div className="academy-context-example">
          <p>
            {splitTextWithGlossaryTerms(
              "Tu carga financiera actual está dentro del rango aceptable, pero tu pie cubre solo el 64% de lo requerido. Si mejoras tu ahorro o exploras un subsidio, podrías reducir tu dividendo mensual y acceder a un plazo más corto."
            ).map((part, i) =>
              typeof part === "string" ? (
                <React.Fragment key={i}>{part}</React.Fragment>
              ) : (
                <GlossaryTerm key={i} term={part.term} onOpenArticle={openArticle} />
              )
            )}
          </p>
        </div>
        <p className="academy-context-note">Los términos subrayados son interactivos: al hacer clic se abre una explicación breve con acceso directo al artículo completo.</p>
      </div>

      <ArticleModal
        article={activeArticle}
        onClose={closeArticle}
        onOpenArticle={openArticle}
        related={relatedArticles}
      />
    </section>
  );
}
