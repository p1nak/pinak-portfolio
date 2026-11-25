/**
 * Pinak Chauhan - Portfolio Project Data
 * Structured, editable project repository containing all verified metadata,
 * metrics, architecture highlights, links, and contextual notes.
 * Restored from commit b8fe8df / a7c969d with verified accuracy refinements.
 */

const PROJECTS_DATA = [
  {
    id: "moodline",
    slug: "moodline",
    title: "Moodline",
    subtitle: "AI-Powered Emotion Prediction System",
    category: "deep-learning",
    badge: "Flagship Deep Learning & NLP",
    flagship: true,
    year: "2026",
    summary: "Bidirectional GRU neural architecture classifying textual input into six distinct human emotional states with an evaluated test accuracy of 91.20%.",
    description: "Moodline processes complex emotional semantics from unstructured user text. Built on a Bidirectional Gated Recurrent Unit (BiGRU) trained via TensorFlow/Keras, it captures nuanced temporal context flowing in both past and future directions across word token sequences. The pipeline features end-to-end tokenization, dynamic sequence padding, and a low-latency FastAPI inference service.",
    metrics: [
      { label: "Test Accuracy", value: "91.20%", highlight: true },
      { label: "Architecture", value: "Bidirectional GRU" },
      { label: "Emotion Classes", value: "6 States" },
      { label: "Inference Engine", value: "FastAPI REST API" }
    ],
    techStack: ["TensorFlow", "Keras", "BiGRU", "Python", "FastAPI", "NLP", "Tokenization", "Render"],
    githubUrl: "https://github.com/p1nak/Moodline-AI-Powered-Emotion-Prediction-System",
    liveUrl: "https://moodline-ai-powered-emotion-prediction.onrender.com",
    architecture: "Input Text → Regex Normalization → Tokenizer Sequence Mapping → Padding (MaxLen) → Embedding Layer → Spatial Dropout → Bidirectional GRU (128 units) → Dense Softmax → 6 Emotion Probabilities",
    disclaimer: null,
    illustration: "moodline-svg"
  },
  {
    id: "credit-ledger",
    slug: "credit-ledger",
    title: "Credit Ledger",
    subtitle: "ML-Based Loan Risk Assessment System",
    category: "machine-learning",
    badge: "Supervised Learning & Risk Modeling",
    flagship: true,
    year: "2026",
    summary: "High-precision credit risk classification leveraging calibrated XGBoost with SHAP explainability across 32,416 validated credit records.",
    description: "Credit Ledger provides an interpretable credit applicant risk assessment engine. Trained on 32,581 initial financial records (refined to 32,416 cleaned instances), the system utilizes an XGBoost classifier with Isotonic Probability Calibration. Incorporating SHAP (SHapley Additive exPlanations), the model offers feature-attribution transparency for loan officers, operating at an optimized decision cutoff threshold of 0.7331.",
    metrics: [
      { label: "ROC-AUC Score", value: "0.939", highlight: true },
      { label: "F1 Score", value: "0.791" },
      { label: "Cleaned Records", value: "32,416" },
      { label: "Decision Threshold", value: "0.7331" }
    ],
    techStack: ["XGBoost", "Scikit-Learn", "SHAP", "FastAPI", "Pandas", "NumPy", "Probability Calibration"],
    githubUrl: "https://github.com/p1nak/Credit-Ledger-ML-Based-Loan-Risk-Assessment-System",
    liveUrl: "https://credit-ledger-ml-based-loan-risk.onrender.com",
    architecture: "Applicant Demographics & Financial History → Missing Value Imputation → One-Hot & Robust Scaling → XGBoost Gradient Boosting → Isotonic Calibration (Threshold: 0.7331) → SHAP Feature Explanations → FastAPI Response",
    disclaimer: "Evaluation Context: Metrics represent research validation benchmarks on the designated dataset, not proof of commercial underwriting performance.",
    illustration: "credit-svg"
  },
  {
    id: "nyc-airbnb",
    slug: "nyc-airbnb",
    title: "NYC Room Type Predictor",
    subtitle: "Spatial & Listing Classification Model",
    category: "machine-learning",
    badge: "Multiclass Ensemble Model",
    flagship: false,
    year: "2026",
    summary: "Random Forest multiclass classifier predicting room categories across 48,800+ New York City listings based on geospatial and pricing attributes.",
    description: "Analyzing the diverse New York City short-term rental landscape, this predictive model segments listings into three primary room categories: Entire home/apt, Private room, and Shared room. The pipeline extracts coordinate geocoding, neighborhood cluster indicators, pricing densities, and availability dynamics to achieve an 85.6% test accuracy and 0.742 Macro-F1.",
    metrics: [
      { label: "Test Accuracy", value: "85.6%", highlight: true },
      { label: "Macro-F1", value: "0.742" },
      { label: "Dataset Size", value: "48,800+ Listings" },
      { label: "Classes", value: "3 Room Types" }
    ],
    techStack: ["Random Forest", "Scikit-Learn", "FastAPI", "Geo-features", "Pandas", "Matplotlib"],
    githubUrl: "https://github.com/p1nak/NYC-Room-Type-Predictor",
    liveUrl: "https://nyc-room-type-predictor-5.onrender.com",
    architecture: "Raw Listing Attributes (Borough, Coordinates, Price, Min Nights, Reviews) → Geo-Clustering & Outlier Clipping → Random Forest Ensemble (150 Estimators) → Multiclass Probability Softmax → FastAPI Microservice",
    disclaimer: null,
    illustration: "airbnb-svg"
  },
  {
    id: "gearbox-maintenance",
    slug: "gearbox-maintenance",
    title: "Gearbox Predictive Maintenance",
    subtitle: "Vibration Sensor Signal Analysis",
    category: "machine-learning",
    badge: "Industrial Diagnostics & Signal Processing",
    flagship: false,
    year: "2026",
    summary: "Experimental fault detection architecture analyzing 52 extracted statistical and FFT signal features across four vibration channels to distinguish healthy versus broken gear states.",
    description: "Industrial machinery diagnostics require rapid anomaly identification to prevent catastrophic downtime. This project evaluates four synchronous vibration sensor channels installed on a planetary gearbox testbench. It computes 52 statistical, time-domain, and FFT frequency-domain characteristics (RMS, kurtosis, crest factor, spectral power). Five algorithms (Logistic Regression, KNN, Decision Tree, Random Forest, SVM) were systematically benchmarked with cross-validation.",
    metrics: [
      { label: "Sensor Channels", value: "4 Accelerometers" },
      { label: "Extracted Features", value: "52 Statistical/FFT", highlight: true },
      { label: "Algorithms Compared", value: "5 Models (SVM, RF, KNN)" },
      { label: "Classification", value: "Healthy vs. Broken-Tooth" }
    ],
    techStack: ["Python", "SciPy", "Scikit-Learn", "Signal Processing", "Feature Extraction", "Pandas"],
    githubUrl: "https://github.com/p1nak/predictive-maintenance-gearbox",
    liveUrl: null,
    architecture: "4-Channel Accelerometer Time-Series → Windowed Slicing → 52 Statistical/FFT Feature Extraction → Standardization → Cross-Validated Multi-Model Evaluation (SVM / Random Forest) → Fault Diagnostic Classification",
    disclaimer: "Experimental Testbench Context: Validation results depend on the available experimental gearbox testbench dataset and cross-validation protocol rather than proven general industrial deployment performance.",
    illustration: "gearbox-svg"
  },
  {
    id: "student-wellness",
    slug: "student-wellness",
    title: "Student Wellness Score",
    subtitle: "Mental Health Regression Estimator",
    category: "machine-learning",
    badge: "Health Informatics & Regression",
    flagship: false,
    year: "2026",
    summary: "Multivariate Random Forest regression model predicting student mental health composite indicators from 12 behavioral and academic lifestyle features.",
    description: "An empirical investigation into factors affecting student wellbeing across 5,000 academic records. Utilizing Random Forest regression, the model evaluates 12 input features including sleep duration, study pressure, academic workload, financial stress, and physical activity. Evaluated against rigorous regression baselines, achieving an R² of 0.8776 with an MAE of 0.3472 and RMSE of 0.4637.",
    metrics: [
      { label: "Coefficient R²", value: "0.8776", highlight: true },
      { label: "Mean Absolute Error", value: "0.3472" },
      { label: "RMSE", value: "0.4637" },
      { label: "Analyzed Records", value: "5,000 Cohort" }
    ],
    techStack: ["Random Forest Regressor", "Scikit-Learn", "FastAPI", "Pandas", "NumPy", "Seaborn"],
    githubUrl: "https://github.com/p1nak/Mental-Health-Score",
    liveUrl: "https://mental-health-score-4-nvs1.onrender.com",
    architecture: "12 Lifestyle Features → Variance Thresholding → StandardScaler → Random Forest Regressor → Composite Wellbeing Score Estimation → FastAPI Endpoint",
    disclaimer: "This project provides an educational estimate only. It is not a clinical assessment, diagnosis, or substitute for professional care.",
    illustration: "wellness-svg"
  },
  {
    id: "gyan-prapti",
    slug: "gyan-prapti",
    title: "Gyan Prapti",
    subtitle: "Smart Capacity Building Platform (SIH)",
    category: "software-engineering",
    badge: "Smart India Hackathon • AI Architecture",
    flagship: true,
    year: "2026",
    summary: "Comprehensive organizational capacity building portal integrating automated competency evaluation, Gemini-assisted question generation, and human-in-the-loop review.",
    description: "Engineered for national capacity building under the Smart India Hackathon (SIH101 challenge), Gyan Prapti unifies assessment, learning path curation, and enterprise administration. Built on Django 5.2, the system pairs generative AI question synthesis via the Google Gemini API with mandatory human reviewer validation workflows. Technical schema documentation outlines an architecture comprising 24 data models and 57 endpoints.",
    metrics: [
      { label: "Framework", value: "Django 5.2" },
      { label: "Documented Schema", value: "24 Models / 57 Endpoints*", highlight: true },
      { label: "GenAI Engine", value: "Google Gemini API" },
      { label: "Review Model", value: "Human-in-the-Loop" }
    ],
    techStack: ["Django 5.2", "Python", "Google Gemini API", "PostgreSQL", "REST APIs", "Tailwind CSS"],
    githubUrl: "https://github.com/p1nak/GyanPrapti-SIH101",
    liveUrl: null,
    architecture: "Role-Based Portal → Competency Taxonomy Engine → Gemini API Automated MCQ Generator → Human Trainer Approval Queue → Assessment Evaluation Engine → Analytical Reporting Dashboards",
    disclaimer: "*Schema Attribution: The 24 data models and 57 endpoints are cited from the project's technical schema documentation.",
    illustration: "gyan-svg"
  },
  {
    id: "lstm-next-word",
    slug: "lstm-next-word",
    title: "LSTM Next Word Predictor",
    subtitle: "Sequential Language Model",
    category: "deep-learning",
    badge: "Recurrent Neural Networks",
    flagship: false,
    year: "2026",
    summary: "Stacked LSTM sequence model generating probabilistic lexical completions from text corpora with an interactive Streamlit UI.",
    description: "An implementation of recurrent neural mechanics for language modeling. Designed with stacked Keras LSTM cells to learn long-range dependency contexts across literary texts. Features automated tokenization sequences, categorical cross-entropy loss convergence, temperature-controlled next-token sampling, and an intuitive Streamlit interface for live interactive typing synthesis.",
    metrics: [
      { label: "Core Model", value: "Stacked LSTM Cells" },
      { label: "Framework", value: "TensorFlow / Keras" },
      { label: "Interface", value: "Streamlit UI", highlight: true },
      { label: "Sampling", value: "Temperature Softmax" }
    ],
    techStack: ["TensorFlow", "Keras", "LSTM", "Python", "Streamlit", "NLTK", "Text Preprocessing"],
    githubUrl: "https://github.com/p1nak/LSTM-Next-Word-Prediction",
    liveUrl: null,
    architecture: "Character / Word Corpus → N-gram Sequence Generation → Word Embedding Encoding → Stacked LSTM Layers → Dense Softmax → Temperature Token Sampler → Streamlit Live Output",
    disclaimer: null,
    illustration: "lstm-svg"
  },
  {
    id: "global-placement",
    slug: "global-placement",
    title: "Global Student Placement Dashboard",
    subtitle: "Academic Career Analytics Suite",
    category: "data-science",
    badge: "Interactive Analytics & Dashboards",
    flagship: false,
    year: "2026",
    summary: "Multi-dimensional analytical portal visualizing international university placement statistics, compensation dynamics, and employer trends.",
    description: "A production analytical dashboard created with Plotly Dash and Pandas. It delivers drill-down visibility into university graduate recruitment patterns across geographic regions, industry domains, and salary distributions. Implements dynamic cross-filtering, quantile compensation spreads, and cohort demographic correlations.",
    metrics: [
      { label: "Dashboard Stack", value: "Plotly + Dash", highlight: true },
      { label: "Data Engine", value: "Pandas & NumPy" },
      { label: "Visualizations", value: "Cross-Filtered Charts" },
      { label: "Domain", value: "Higher Ed Analytics" }
    ],
    techStack: ["Dash", "Plotly", "Python", "Pandas", "NumPy", "Data Visualization"],
    githubUrl: "https://github.com/p1nak/global-student-placement-dashboard",
    liveUrl: null,
    architecture: "Placement Microdata → Pandas Cleansing & Aggregation Pipelines → Reactive Dash Callbacks → Multi-Chart Interactive Visualizations (Boxplots, Scatter, Geo Distributions)",
    disclaimer: null,
    illustration: "placement-svg"
  },
  {
    id: "amazon-stock",
    slug: "amazon-stock",
    title: "Amazon Stock Analysis Dashboard",
    subtitle: "Financial Time-Series & Volatility Tracker",
    category: "data-science",
    badge: "Quantitative Finance & Time-Series",
    flagship: false,
    year: "2026",
    summary: "Quantitative financial dashboard analyzing historical Amazon equity performance, rolling moving averages (SMA), Bollinger Bands, and RSI.",
    description: "Built for quantitative exploration of equity price action. This dashboard performs algorithmic time-series decomposition on historical AMZN ticker records. Features automated calculation of Simple Moving Averages (SMA), Bollinger Band volatility channels, Relative Strength Index (RSI), and trading volume correlations rendered in high-refresh Plotly interfaces.",
    metrics: [
      { label: "Analytics Engine", value: "Time-Series Rolling Ops", highlight: true },
      { label: "Key Indicators", value: "SMA / Bollinger / RSI" },
      { label: "Visualization", value: "Plotly + Dash Suite" },
      { label: "Stack", value: "Python, Dash, Pandas" }
    ],
    techStack: ["Plotly", "Dash", "Pandas", "Time-Series Analysis", "Python", "Financial Modeling"],
    githubUrl: "https://github.com/p1nak/amazon-stock-analysis-dashboard",
    liveUrl: null,
    architecture: "OHLCV Stock History → Date Indexing & Missing Fill → Rolling Window Technical Metric Computation (SMA, Bollinger Bands, RSI) → Plotly Interactive Candlestick & Indicator Layers → Live Filterable Dashboard",
    disclaimer: null,
    illustration: "stock-svg"
  },
  {
    id: "ml-work",
    slug: "ml-work",
    title: "ML Work — Core Algorithms & Pipelines",
    subtitle: "Foundational Machine Learning Implementations",
    category: "machine-learning",
    badge: "Algorithmic Rigor & Notebooks",
    flagship: false,
    year: "2026",
    summary: "Systematic collection of end-to-end machine learning workflows spanning PCA dimensionality reduction, GridSearchCV hyperparameter tuning, and five-fold stratified cross-validation.",
    description: "A centralized repository cataloging mathematical and practical implementations of core machine learning techniques in Scikit-learn. Encompasses rigorous exploratory data analysis (EDA), data cleaning methodologies, outlier treatments, PCA dimensionality reduction, five-fold stratified cross-validation evaluation loops, and model parameter optimization via GridSearchCV.",
    metrics: [
      { label: "Validation", value: "5-Fold Stratified CV", highlight: true },
      { label: "Feature Pipeline", value: "PCA, Encoding, Scaling" },
      { label: "Optimization", value: "GridSearchCV Tuning" },
      { label: "Tooling", value: "Jupyter & Scikit-Learn" }
    ],
    techStack: ["Python", "Scikit-Learn", "PCA", "GridSearchCV", "Pandas", "NumPy", "Jupyter"],
    githubUrl: "https://github.com/p1nak/ML-WORK",
    liveUrl: null,
    architecture: "Raw Experimental Datasets → Comprehensive EDA & Correlation Matrices → Feature Transformation & PCA → 5-Fold Stratified Cross-Validation & GridSearchCV → Metric Evaluation Curves",
    disclaimer: null,
    illustration: "mlwork-svg"
  },
  {
    id: "industrial-internship",
    slug: "industrial-internship",
    title: "Industrial Systems & Telemetry Suite",
    subtitle: "Digital QC, QR Serialization & Telemetry",
    category: "software-engineering",
    badge: "Manufacturing IoT & Enterprise Software",
    flagship: false,
    year: "2026",
    summary: "Production-grade industrial software suite featuring a Flask digital QC audit platform, QR machine tracking, and Sand Plant IoT telemetry ingestion.",
    description: "Developed during engineering practice with Rhino Machines Pvt. Ltd. The suite replaces paper inspection processes with a secure Flask web portal featuring role-based access control, photographic defect logs, and automated PDF inspection report generators. Furthermore, it incorporates QR code serialization for machine assemblies and telemetry pipelines integrating Python, InfluxDB, and Grafana for sand plant monitoring.",
    metrics: [
      { label: "Industrial Web App", value: "Flask + SQLite" },
      { label: "Telemetry Pipeline", value: "InfluxDB + Grafana", highlight: true },
      { label: "Field Capability", value: "QR Equipment Tracking" },
      { label: "Deployment", value: "Shopfloor Production" }
    ],
    techStack: ["Flask", "Python", "SQLite", "InfluxDB", "Grafana", "Pandas", "IoT Telemetry"],
    githubUrl: "https://github.com/p1nak/Internship-Project",
    liveUrl: null,
    architecture: "Shopfloor Workstation / Sensors → Flask Digital QC Form & Image Upload → SQLite Relational DB → InfluxDB Time-Series Ingestion → Grafana Telemetry Dashboard & QR Scanner Tracking",
    disclaimer: null,
    illustration: "internship-svg"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROJECTS_DATA };
}
