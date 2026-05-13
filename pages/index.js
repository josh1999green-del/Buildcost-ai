import { useState, useEffect } from 'react';
import Head from 'next/head';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  :root {
    --gold: #C8960C;
    --gold-light: #E8B832;
    --gold-dim: #8A6508;
    --gold-glow: rgba(200,150,12,0.15);
    --bg: #0F0F0D;
    --bg2: #161614;
    --bg3: #1E1E1C;
    --bg4: #252523;
    --border: rgba(200,150,12,0.15);
    --border-subtle: rgba(255,255,255,0.06);
    --text: #F0F0EE;
    --text-dim: #9A9A98;
    --text-muted: #5A5A58;
    --green: #22C55E;
    --red: #EF4444;
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ── NAV ── */
  .nav {
    position: fixed; top:0; left:0; right:0; z-index:200;
    padding: 0 48px;
    height: 68px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(15,15,13,0.9);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border-subtle);
    transition: border-color 0.3s;
  }
  .nav.scrolled { border-color: var(--border); }

  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 20px;
    text-decoration: none; color: var(--text);
    letter-spacing: -0.3px;
  }
  .nav-logo-icon {
    width:34px; height:34px; background: var(--gold); border-radius:8px;
    display:flex; align-items:center; justify-content:center; font-size:17px;
    box-shadow: 0 0 20px rgba(200,150,12,0.4);
  }
  .nav-logo span { color: var(--gold); }

  .nav-links { display:flex; align-items:center; gap:28px; list-style:none; }
  .nav-links a {
    color: var(--text-dim); text-decoration:none; font-size:14px; font-weight:500;
    transition: color 0.2s; cursor: pointer;
  }
  .nav-links a:hover { color: var(--text); }

  .nav-actions { display:flex; align-items:center; gap:12px; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px; border-radius: 8px; font-size:14px; font-weight:600;
    cursor: pointer; border: none; text-decoration:none;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif; white-space:nowrap;
  }
  .btn-gold {
    background: var(--gold); color: #0F0F0D;
    box-shadow: 0 0 24px rgba(200,150,12,0.3);
  }
  .btn-gold:hover { background: var(--gold-light); box-shadow: 0 0 32px rgba(200,150,12,0.5); transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--text-dim); border: 1px solid var(--border-subtle); }
  .btn-ghost:hover { border-color: var(--border); color: var(--text); background: rgba(255,255,255,0.03); }
  .btn-outline { background: transparent; color: var(--gold); border: 1px solid rgba(200,150,12,0.4); }
  .btn-outline:hover { background: var(--gold-glow); border-color: var(--gold); }
  .btn-lg { padding: 14px 32px; font-size:15px; border-radius:10px; }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 120px 24px 80px;
    position: relative; overflow: hidden;
    text-align: center;
  }

  .hero-grid {
    position: absolute; inset:0;
    background-image:
      linear-gradient(rgba(200,150,12,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,150,12,0.05) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 80%);
  }

  .hero-glow {
    position: absolute; top:20%; left:50%; transform:translateX(-50%);
    width:600px; height:400px;
    background: radial-gradient(ellipse, rgba(200,150,12,0.12) 0%, transparent 70%);
    pointer-events:none;
  }

  .hero-badge {
    display: inline-flex; align-items:center; gap:8px;
    padding: 6px 16px; border-radius:999px;
    border: 1px solid rgba(200,150,12,0.3);
    background: rgba(200,150,12,0.08);
    font-size: 13px; color: var(--gold-light); font-weight:500;
    margin-bottom: 28px; position:relative; z-index:1;
  }
  .hero-badge-dot {
    width:6px; height:6px; border-radius:50%; background:var(--gold);
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }

  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(40px, 6vw, 76px);
    font-weight: 800; line-height: 1.05;
    letter-spacing: -2px;
    position: relative; z-index:1; margin-bottom: 24px;
  }
  .hero h1 em { font-style:normal; color: var(--gold); }

  .hero-sub {
    font-size: clamp(16px, 2vw, 20px);
    color: var(--text-dim); max-width: 560px;
    line-height: 1.6; position:relative; z-index:1; margin-bottom:40px;
  }

  .hero-actions { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; position:relative; z-index:1; }

  .hero-stats {
    display: flex; gap: 48px; justify-content:center; flex-wrap:wrap;
    margin-top: 64px; position:relative; z-index:1;
    padding-top: 48px; border-top: 1px solid var(--border-subtle);
    width: 100%; max-width: 640px;
  }
  .hero-stat-val { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:var(--gold); }
  .hero-stat-lbl { font-size:13px; color:var(--text-dim); margin-top:2px; }

  /* ── DASHBOARD PREVIEW ── */
  .preview-wrap {
    width: 100%; max-width: 900px; margin: 0 auto;
    position: relative; z-index:1; margin-top: 64px;
  }
  .preview-frame {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(200,150,12,0.08);
  }
  .preview-bar {
    background: var(--bg3); padding:12px 16px;
    display:flex; align-items:center; gap:8px;
    border-bottom: 1px solid var(--border-subtle);
  }
  .preview-dot { width:10px;height:10px;border-radius:50%; }
  .preview-url {
    flex:1; background:var(--bg4); border-radius:6px;
    padding:5px 12px; font-size:12px; color:var(--text-muted); text-align:center;
    margin: 0 8px;
  }
  .preview-body { padding:20px; display:grid; grid-template-columns:220px 1fr; gap:16px; min-height:360px; }
  .preview-sidebar { display:flex; flex-direction:column; gap:8px; }
  .preview-nav-item {
    padding:10px 14px; border-radius:8px; font-size:13px; font-weight:500;
    display:flex; align-items:center; gap:10px; cursor:pointer; color:var(--text-dim);
    transition:all 0.2s;
  }
  .preview-nav-item.active { background:var(--gold-glow); color:var(--gold); border: 1px solid rgba(200,150,12,0.2); }
  .preview-main { display:flex; flex-direction:column; gap:12px; }
  .preview-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
  .preview-h { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; }
  .preview-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  .preview-card {
    background:var(--bg3); border:1px solid var(--border-subtle);
    border-radius:10px; padding:14px;
  }
  .preview-card-label { font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; }
  .preview-card-val { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; }
  .preview-card-val.gold { color:var(--gold); }
  .preview-card-val.green { color:var(--green); }
  .preview-table { background:var(--bg3); border:1px solid var(--border-subtle); border-radius:10px; overflow:hidden; }
  .preview-th { display:grid; grid-template-columns:1fr 80px 90px 90px; gap:8px; padding:8px 14px; background:var(--bg4); font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.6px; }
  .preview-tr { display:grid; grid-template-columns:1fr 80px 90px 90px; gap:8px; padding:9px 14px; font-size:12px; border-top:1px solid var(--border-subtle); }
  .preview-tr:nth-child(even) { background:rgba(255,255,255,0.015); }
  .tag { display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600; }
  .tag-green { background:rgba(34,197,94,0.15); color:var(--green); }
  .tag-gold { background:rgba(200,150,12,0.15); color:var(--gold); }

  /* ── SECTIONS ── */
  section { padding: 100px 24px; }
  .container { max-width: 1120px; margin: 0 auto; }
  .section-label { font-size:13px; text-transform:uppercase; letter-spacing:2px; color:var(--gold); font-weight:600; margin-bottom:14px; }
  .section-h { font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,46px); font-weight:800; letter-spacing:-1.5px; line-height:1.1; margin-bottom:16px; }
  .section-sub { font-size:17px; color:var(--text-dim); max-width:520px; line-height:1.65; }

  /* ── HOW IT WORKS ── */
  .steps { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; margin-top:64px; background:var(--border-subtle); border-radius:16px; overflow:hidden; }
  .step { background:var(--bg2); padding:40px 32px; position:relative; }
  .step-num { font-family:'Syne',sans-serif; font-size:48px; font-weight:800; color:rgba(200,150,12,0.15); line-height:1; margin-bottom:20px; }
  .step-icon { font-size:28px; margin-bottom:16px; }
  .step-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; margin-bottom:10px; }
  .step-desc { font-size:14px; color:var(--text-dim); line-height:1.65; }
  .step-connector { display:none; }

  /* ── FEATURES ── */
  .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:64px; }
  .feature-card {
    background:var(--bg2); border:1px solid var(--border-subtle);
    border-radius:14px; padding:28px;
    transition:all 0.3s;
  }
  .feature-card:hover { border-color:var(--border); transform:translateY(-3px); box-shadow:0 20px 60px rgba(0,0,0,0.3); }
  .feature-icon { font-size:28px; margin-bottom:16px; }
  .feature-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; margin-bottom:8px; }
  .feature-desc { font-size:13px; color:var(--text-dim); line-height:1.65; }

  /* ── PRICING ── */
  .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:64px; align-items:start; }
  .pricing-card {
    background:var(--bg2); border:1px solid var(--border-subtle);
    border-radius:16px; padding:32px; position:relative; overflow:hidden;
  }
  .pricing-card.featured {
    background:var(--bg3); border-color:var(--border);
    box-shadow:0 0 60px rgba(200,150,12,0.1);
  }
  .pricing-card.featured::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-dim));
  }
  .pricing-badge {
    position:absolute; top:20px; right:20px;
    background:var(--gold); color:#0F0F0D;
    font-size:11px; font-weight:700; padding:4px 10px; border-radius:4px;
    text-transform:uppercase; letter-spacing:0.5px;
  }
  .pricing-name { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; margin-bottom:6px; }
  .pricing-desc { font-size:13px; color:var(--text-dim); margin-bottom:24px; line-height:1.5; }
  .pricing-price { font-family:'Syne',sans-serif; font-size:42px; font-weight:800; line-height:1; }
  .pricing-price span { font-size:16px; font-weight:400; color:var(--text-dim); }
  .pricing-period { font-size:13px; color:var(--text-muted); margin-bottom:28px; margin-top:4px; }
  .pricing-divider { border:none; border-top:1px solid var(--border-subtle); margin:24px 0; }
  .pricing-features { list-style:none; display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }
  .pricing-features li { font-size:13px; color:var(--text-dim); display:flex; align-items:center; gap:10px; }
  .pricing-features li::before { content:'✓'; color:var(--gold); font-weight:700; flex-shrink:0; }

  /* ── TESTIMONIALS ── */
  .testimonials-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:64px; }
  .testi-card {
    background:var(--bg2); border:1px solid var(--border-subtle);
    border-radius:14px; padding:28px;
  }
  .testi-stars { color:var(--gold); font-size:14px; margin-bottom:14px; }
  .testi-text { font-size:14px; color:var(--text-dim); line-height:1.7; margin-bottom:20px; font-style:italic; }
  .testi-author { display:flex; align-items:center; gap:12px; }
  .testi-avatar {
    width:38px; height:38px; border-radius:50%; background:var(--gold-glow);
    border:1px solid var(--border); display:flex; align-items:center; justify-content:center;
    font-size:15px;
  }
  .testi-name { font-size:13px; font-weight:600; }
  .testi-role { font-size:12px; color:var(--text-muted); margin-top:2px; }

  /* ── CTA SECTION ── */
  .cta-section {
    background: var(--bg2); border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    padding: 100px 24px;
    text-align: center; position:relative; overflow:hidden;
  }
  .cta-glow {
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:500px; height:300px;
    background:radial-gradient(ellipse, rgba(200,150,12,0.1) 0%, transparent 70%);
  }
  .cta-section h2 { font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,52px); font-weight:800; letter-spacing:-1.5px; margin-bottom:16px; position:relative; }
  .cta-section p { font-size:17px; color:var(--text-dim); margin-bottom:40px; position:relative; }
  .cta-actions { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; position:relative; }

  /* ── FOOTER ── */
  footer {
    padding: 48px; display:flex; align-items:center; justify-content:space-between;
    border-top: 1px solid var(--border-subtle); flex-wrap:wrap; gap:20px;
  }
  .footer-links { display:flex; gap:24px; list-style:none; flex-wrap:wrap; }
  .footer-links a { font-size:13px; color:var(--text-muted); text-decoration:none; cursor:pointer; transition:color 0.2s; }
  .footer-links a:hover { color:var(--text-dim); }
  .footer-copy { font-size:13px; color:var(--text-muted); }

  /* ── DASHBOARD ── */
  .dash-layout { display:flex; min-height:100vh; }
  .dash-sidebar {
    width:240px; background:var(--bg2); border-right:1px solid var(--border-subtle);
    padding:24px 16px; display:flex; flex-direction:column; gap:4px; flex-shrink:0;
    position:fixed; top:0; left:0; bottom:0; z-index:100; overflow-y:auto;
  }
  .dash-logo {
    display:flex; align-items:center; gap:10px;
    font-family:'Syne',sans-serif; font-weight:800; font-size:18px; margin-bottom:24px; padding:8px 12px;
    color:var(--text); text-decoration:none;
  }
  .dash-logo span { color:var(--gold); }
  .dash-logo-icon {
    width:32px; height:32px; background:var(--gold); border-radius:7px;
    display:flex; align-items:center; justify-content:center; font-size:15px;
    box-shadow:0 0 16px rgba(200,150,12,0.4);
  }
  .dash-nav-section { font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-muted); padding:12px 12px 6px; margin-top:8px; }
  .dash-nav-item {
    display:flex; align-items:center; gap:11px;
    padding:10px 12px; border-radius:8px; font-size:13px; font-weight:500;
    color:var(--text-dim); cursor:pointer; transition:all 0.15s;
    border:1px solid transparent;
  }
  .dash-nav-item:hover { background:rgba(255,255,255,0.04); color:var(--text); }
  .dash-nav-item.active { background:var(--gold-glow); color:var(--gold); border-color:rgba(200,150,12,0.2); }
  .dash-nav-icon { width:18px; text-align:center; }
  .dash-main { margin-left:240px; flex:1; padding:32px 36px; min-height:100vh; background:var(--bg); }
  .dash-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
  .dash-page-title { font-family:'Syne',sans-serif; font-size:24px; font-weight:800; }
  .dash-topbar-actions { display:flex; gap:10px; align-items:center; }
  .dash-avatar { width:34px; height:34px; border-radius:50%; background:var(--gold-glow); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:14px; cursor:pointer; }

  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
  .stat-card {
    background:var(--bg2); border:1px solid var(--border-subtle);
    border-radius:12px; padding:20px 22px;
    transition:border-color 0.2s;
  }
  .stat-card:hover { border-color:var(--border); }
  .stat-label { font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .stat-value { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; margin-bottom:4px; }
  .stat-value.gold { color:var(--gold); }
  .stat-value.green { color:var(--green); }
  .stat-change { font-size:12px; color:var(--green); }
  .stat-change.down { color:var(--red); }

  .dash-grid { display:grid; grid-template-columns:1fr 340px; gap:16px; margin-bottom:16px; }

  .card {
    background:var(--bg2); border:1px solid var(--border-subtle);
    border-radius:14px; overflow:hidden;
  }
  .card-header { padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:space-between; }
  .card-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; }
  .card-body { padding:20px 22px; }

  .projects-table { width:100%; border-collapse:collapse; }
  .projects-table th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-muted); padding:8px 12px; border-bottom:1px solid var(--border-subtle); }
  .projects-table td { padding:12px 12px; font-size:13px; border-bottom:1px solid var(--border-subtle); vertical-align:middle; }
  .projects-table tr:last-child td { border-bottom:none; }
  .projects-table tr:hover td { background:rgba(255,255,255,0.02); }
  .project-name { font-weight:600; color:var(--text); display:block; }
  .project-client { font-size:11px; color:var(--text-muted); }

  .activity-list { display:flex; flex-direction:column; gap:0; }
  .activity-item { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid var(--border-subtle); }
  .activity-item:last-child { border-bottom:none; }
  .activity-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px; }
  .activity-text { font-size:13px; color:var(--text-dim); line-height:1.5; }
  .activity-time { font-size:11px; color:var(--text-muted); margin-top:2px; }

  /* ── GENERATE MODAL ── */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(8px);
    z-index:500; display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .modal {
    background:var(--bg2); border:1px solid var(--border);
    border-radius:20px; width:100%; max-width:560px;
    box-shadow:0 40px 100px rgba(0,0,0,0.5);
    max-height:90vh; overflow-y:auto;
  }
  .modal-header { padding:24px 28px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:space-between; }
  .modal-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; }
  .modal-close { background:none; border:none; color:var(--text-muted); font-size:20px; cursor:pointer; transition:color 0.2s; }
  .modal-close:hover { color:var(--text); }
  .modal-body { padding:28px; }
  .form-group { margin-bottom:18px; }
  .form-label { font-size:12px; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-dim); font-weight:600; margin-bottom:8px; display:block; }
  .form-input, .form-select, .form-textarea {
    width:100%; background:var(--bg3); border:1px solid var(--border-subtle);
    border-radius:8px; padding:11px 14px; font-size:14px; color:var(--text);
    font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s;
    -webkit-appearance:none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color:var(--border); }
  .form-textarea { min-height:80px; resize:vertical; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .upload-zone {
    border:2px dashed var(--border-subtle); border-radius:10px;
    padding:28px; text-align:center; cursor:pointer; transition:all 0.2s;
    background:var(--bg3);
  }
  .upload-zone:hover { border-color:var(--border); background:rgba(200,150,12,0.03); }
  .upload-icon { font-size:28px; margin-bottom:10px; }
  .upload-text { font-size:13px; color:var(--text-dim); }
  .upload-hint { font-size:11px; color:var(--text-muted); margin-top:4px; }
  .modal-footer { padding:0 28px 28px; display:flex; gap:10px; justify-content:flex-end; }

  /* ── GENERATING ANIMATION ── */
  .generating-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.9); backdrop-filter:blur(12px);
    z-index:600; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px;
  }
  .gen-spinner {
    width:56px; height:56px; border-radius:50%;
    border:3px solid var(--border-subtle); border-top-color:var(--gold);
    animation:spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  .gen-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; }
  .gen-steps { display:flex; flex-direction:column; gap:10px; width:320px; }
  .gen-step { display:flex; align-items:center; gap:12px; font-size:13px; color:var(--text-dim); transition:color 0.3s; }
  .gen-step.done { color:var(--green); }
  .gen-step.active { color:var(--text); }
  .gen-step-icon { width:20px; height:20px; border-radius:50%; border:1px solid currentColor; display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; }

  @media (max-width:900px) {
    .nav { padding:0 20px; }
    .nav-links { display:none; }
    .steps { grid-template-columns:1fr; }
    .features-grid, .pricing-grid, .testimonials-grid { grid-template-columns:1fr; }
    .dash-sidebar { display:none; }
    .dash-main { margin-left:0; padding:20px; }
    .stats-grid { grid-template-columns:repeat(2,1fr); }
    .dash-grid { grid-template-columns:1fr; }
    footer { padding:32px 24px; flex-direction:column; align-items:flex-start; }
  }
`;

const PROJECTS = [
  { id:1, name:'42 Grasmere Bungalow Extension', client:'Mr & Mrs O\'Reilly', type:'Extension', value:'£124,800', status:'Complete', date:'May 2025' },
  { id:2, name:'Boxton Homes — Plot 4 New Build', client:'Boxton Homes Ltd', type:'New Build', value:'£287,500', status:'In Progress', date:'May 2025' },
  { id:3, name:'Riverside Loft Conversion', client:'Sarah Blackwell', type:'Conversion', value:'£68,200', status:'Complete', date:'Apr 2025' },
  { id:4, name:'Commercial Fit-out — Unit 7B', client:'Nexus Property Group', type:'Commercial', value:'£195,000', status:'Draft', date:'Apr 2025' },
  { id:5, name:'Victorian Terrace Full Refurb', client:'David & Jo Marsh', client:'D & J Marsh', type:'Refurb', value:'£112,600', status:'Complete', date:'Mar 2025' },
];

const FEATURES = [
  { icon:'📐', title:'AI Drawing Analysis', desc:'Upload architect drawings (PDF or photo) and our AI reads dimensions, spec, and scope — no manual takeoff.' },
  { icon:'📊', title:'Instant Itemised BOQ', desc:'Get a full Bill of Quantities in seconds: labour, materials, sundries, broken into trades and sections.' },
  { icon:'📥', title:'Excel Export', desc:'Download a polished 3-sheet Excel BOQ — Rates, Detailed BOQ, Trade Summary — ready to hand to a contractor.' },
  { icon:'✏️', title:'Fully Editable Rates', desc:'Pre-filled UK 2025 day rates you can override. Perfect for when a subcontractor quotes differently.' },
  { icon:'🏗', title:'UK-Specific', desc:'Built for UK construction. Rates, trades, VAT, and specification language reflect UK standards throughout.' },
  { icon:'🔒', title:'Your Data, Secure', desc:'Project files are encrypted and never shared. Each BOQ is private to your account.' },
];

const PRICING_PLANS = [
  {
    name:'Starter', desc:'Perfect for sole traders and small builders', price:'Free', period:'Up to 3 BOQs/month',
    features:['3 BOQ generations/month','PDF & Excel export','Basic trade breakdown','Email support'],
    featured:false,
  },
  {
    name:'Pro', desc:'For active builders and estimators', price:'£49', period:'Per month · cancel anytime',
    features:['Unlimited BOQ generations','Priority AI processing','Full itemised BOQ','Drawing upload (PDF/photo)','Revision history','Priority support'],
    featured:true, badge:'Most Popular',
  },
  {
    name:'Business', desc:'For contractors and QS firms', price:'£149', period:'Per month · up to 5 users',
    features:['Everything in Pro','5 user seats','Client-branded exports','API access','Custom rate schedules','Dedicated account manager'],
    featured:false,
  },
];

const TESTIMONIALS = [
  { stars:5, text:'I used to spend a full day putting together a BOQ. BuildCostAI does it in minutes and the numbers are remarkably close to what I\'d have priced manually.', name:'Mark Stevens', role:'Building Contractor, Manchester', avatar:'👷' },
  { stars:5, text:'Sent it to three clients in one afternoon. The Excel export is clean, professional, and exactly what they expect to see. Game changer for winning work.', name:'Karen Liu', role:'Quantity Surveyor, London', avatar:'📋' },
  { stars:5, text:'Upload the architect\'s drawings and it just works. It even picked up the steelwork spec from the SE drawings which I didn\'t expect at all.', name:'Tom Boxton', role:'Director, Boxton Homes Ltd', avatar:'🏗' },
];

export default function BuildCostAI() {
  const [view, setView] = useState('landing');
  const [dashTab, setDashTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name:'', client:'', type:'Extension', address:'', notes:'' });
  const [drawings, setDrawings] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDrawings(prev => {
      const combined = [...prev, ...files];
      return combined.slice(0, 10);
    });
  };

  const removeDrawing = (index) => {
    setDrawings(prev => prev.filter((_,i) => i !== index));
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleGenerate = () => {
    setShowModal(false);
    setGenerating(true);
    setGenStep(0);
    const steps = [0,1,2,3,4];
    steps.forEach((s,i) => setTimeout(() => setGenStep(s+1), i*900+200));
    setTimeout(() => { setGenerating(false); setView('dashboard'); setDashTab('projects'); }, 5200);
  };

  const statusColor = s => s === 'Complete' ? 'tag-green' : s === 'In Progress' ? 'tag-gold' : 'tag';

  if (view === 'dashboard') {
    return (
      <>
        <Head><title>Dashboard — BuildCostAI</title></Head>
        <style>{STYLES}</style>

        {/* Sidebar */}
        <div className="dash-layout">
          <div className="dash-sidebar">
            <div className="dash-logo">
              <div className="dash-logo-icon">🏗</div>
              BuildCost<span>AI</span>
            </div>
            {[
              { id:'dashboard', icon:'◼', label:'Dashboard' },
              { id:'projects', icon:'📁', label:'Projects' },
              { id:'generate', icon:'✦', label:'New BOQ', action:true },
              { id:'templates', icon:'📄', label:'Templates' },
              { id:'clients', icon:'👤', label:'Clients' },
              { id:'exports', icon:'📥', label:'Exports' },
            ].map(item => (
              <div
                key={item.id}
                className={`dash-nav-item ${dashTab === item.id ? 'active' : ''}`}
                onClick={() => item.id === 'generate' ? setShowModal(true) : setDashTab(item.id)}
              >
                <span className="dash-nav-icon">{item.icon}</span>
                {item.label}
                {item.id === 'generate' && (
                  <span style={{marginLeft:'auto',background:'var(--gold)',color:'#0F0F0D',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'4px'}}>NEW</span>
                )}
              </div>
            ))}
            <div style={{marginTop:'auto',paddingTop:'24px',borderTop:'1px solid var(--border-subtle)'}}>
              <div className="dash-nav-item" onClick={() => setView('landing')}>
                <span className="dash-nav-icon">←</span> Back to Site
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="dash-main">
            <div className="dash-topbar">
              <div className="dash-page-title">
                {dashTab === 'dashboard' ? 'Dashboard' : dashTab === 'projects' ? 'Projects' : dashTab.charAt(0).toUpperCase() + dashTab.slice(1)}
              </div>
              <div className="dash-topbar-actions">
                <button className="btn btn-gold" onClick={() => setShowModal(true)}>+ New BOQ</button>
                <div className="dash-avatar">J</div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {[
                { label:'Total BOQs', value:'24', icon:'📊', change:'+3 this month', color:'gold' },
                { label:'Est. Project Value', value:'£1.2M', icon:'💰', change:'+18% vs last month', color:'green' },
                { label:'Avg BOQ Time', value:'4 min', icon:'⚡', change:'vs 1 day manual' },
                { label:'Active Projects', value:'7', icon:'🔨', change:'2 pending review' },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-label">{s.icon} {s.label}</div>
                  <div className={`stat-value ${s.color || ''}`}>{s.value}</div>
                  <div className="stat-change">{s.change}</div>
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div className="dash-grid">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Recent Projects</div>
                  <button className="btn btn-ghost" style={{padding:'6px 14px',fontSize:'12px'}}>View All</button>
                </div>
                <div className="card-body" style={{padding:0}}>
                  <table className="projects-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PROJECTS.map(p => (
                        <tr key={p.id}>
                          <td>
                            <span className="project-name">{p.name}</span>
                            <span className="project-client">{p.client}</span>
                          </td>
                          <td><span style={{fontSize:'12px',color:'var(--text-dim)'}}>{p.type}</span></td>
                          <td><span style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:'var(--gold)'}}>{p.value}</span></td>
                          <td><span className={`tag ${statusColor(p.status)}`}>{p.status}</span></td>
                          <td><span style={{fontSize:'12px',color:'var(--text-muted)'}}>{p.date}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><div className="card-title">Activity</div></div>
                <div className="card-body" style={{padding:'0 22px'}}>
                  <div className="activity-list">
                    {[
                      { dot:'var(--green)', text:'BOQ generated — Boxton Homes Plot 4', time:'2 hours ago' },
                      { dot:'var(--gold)', text:'Export downloaded — 42 Grasmere v4.xlsx', time:'4 hours ago' },
                      { dot:'var(--blue,#3B82F6)', text:'New project created — Commercial Fit-out Unit 7B', time:'Yesterday' },
                      { dot:'var(--green)', text:'BOQ generated — Riverside Loft Conversion', time:'2 days ago' },
                      { dot:'var(--text-muted)', text:'Account created', time:'14 Apr 2025' },
                    ].map((a,i) => (
                      <div className="activity-item" key={i}>
                        <div className="activity-dot" style={{background:a.dot}} />
                        <div>
                          <div className="activity-text">{a.text}</div>
                          <div className="activity-time">{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New BOQ Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">✦ Generate New BOQ</div>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input className="form-input" placeholder="e.g. Rear Extension — 14 Elm Street" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Client Name</label>
                    <input className="form-input" placeholder="Client or homeowner" value={form.client} onChange={e=>setForm({...form,client:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Type</label>
                    <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                      {['Extension','New Build','Loft Conversion','Refurbishment','Commercial','Garage Conversion'].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Site Address</label>
                  <input className="form-input" placeholder="Full postal address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Upload Drawings — {drawings.length}/10</label>
                  <input
                    id="drawing-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    style={{display:'none'}}
                    onChange={handleFileChange}
                  />
                  {drawings.length < 10 && (
                    <div className="upload-zone" onClick={() => document.getElementById('drawing-upload').click()}
                      onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor='var(--gold)';}}
                      onDragLeave={e=>{e.currentTarget.style.borderColor='';}}
                      onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor='';const files=Array.from(e.dataTransfer.files);setDrawings(prev=>[...prev,...files].slice(0,10));}}
                    >
                      <div className="upload-icon">📐</div>
                      <div className="upload-text">Click or drag drawings here</div>
                      <div className="upload-hint">PDF, JPG, PNG · up to 20MB per file · max 10 drawings</div>
                    </div>
                  )}
                  {drawings.length > 0 && (
                    <div style={{marginTop:'10px',display:'flex',flexDirection:'column',gap:'6px'}}>
                      {drawings.map((f,i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',background:'var(--bg3)',border:'1px solid var(--border-subtle)',borderRadius:'7px',padding:'8px 12px'}}>
                          <span style={{fontSize:'16px'}}>{f.name.endsWith('.pdf') ? '📄' : '🖼'}</span>
                          <span style={{flex:1,fontSize:'13px',color:'var(--text-dim)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</span>
                          <span style={{fontSize:'11px',color:'var(--text-muted)',flexShrink:0}}>{(f.size/1024/1024).toFixed(1)}MB</span>
                          <button onClick={()=>removeDrawing(i)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:'16px',lineHeight:1,padding:'0 2px'}} title="Remove">×</button>
                        </div>
                      ))}
                      {drawings.length < 10 && (
                        <button onClick={()=>document.getElementById('drawing-upload').click()} style={{background:'none',border:'1px dashed var(--border-subtle)',borderRadius:'7px',padding:'7px',fontSize:'12px',color:'var(--text-muted)',cursor:'pointer',marginTop:'2px'}}>
                          + Add more ({10 - drawings.length} remaining)
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Scope Notes</label>
                  <textarea className="form-textarea" placeholder="Brief description of the work scope..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-gold" onClick={handleGenerate}>✦ Generate BOQ</button>
              </div>
            </div>
          </div>
        )}

        {/* Generating overlay */}
        {generating && (
          <div className="generating-overlay">
            <div className="gen-spinner" />
            <div className="gen-title">Generating your BOQ…</div>
            <div className="gen-steps">
              {[
                'Reading architectural drawings',
                'Extracting dimensions and spec',
                'Calculating quantities by trade',
                'Applying 2025 UK rates',
                'Building Excel workbook',
              ].map((s,i) => (
                <div key={s} className={`gen-step ${genStep > i+1 ? 'done' : genStep === i+1 ? 'active' : ''}`}>
                  <div className="gen-step-icon">{genStep > i+1 ? '✓' : genStep === i+1 ? '◉' : '○'}</div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // ── LANDING PAGE ──
  return (
    <>
      <Head>
        <title>BuildCostAI — Instant AI Bill of Quantities for UK Construction</title>
        <meta name="description" content="Upload architect drawings, get a full itemised BOQ in minutes. AI-powered construction estimating built for UK builders and quantity surveyors." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{STYLES}</style>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a className="nav-logo" href="#">
          <div className="nav-logo-icon">🏗</div>
          BuildCost<span>AI</span>
        </a>
        <ul className="nav-links">
          <li><a onClick={() => document.getElementById('how').scrollIntoView({behavior:'smooth'})}>How it works</a></li>
          <li><a onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>Features</a></li>
          <li><a onClick={() => document.getElementById('pricing').scrollIntoView({behavior:'smooth'})}>Pricing</a></li>
        </ul>
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => setView('dashboard')}>Sign in</button>
          <button className="btn btn-gold" onClick={() => { setView('dashboard'); setShowModal(true); }}>Try Free →</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          Now in beta — free access while we grow
        </div>
        <h1>Your BOQ in<br /><em>minutes, not days</em></h1>
        <p className="hero-sub">
          Upload architect drawings. Get a full itemised Bill of Quantities with UK 2025 rates, broken down by trade and ready to export as Excel.
        </p>
        <div className="hero-actions">
          <button className="btn btn-gold btn-lg" onClick={() => { setView('dashboard'); setShowModal(true); }}>🚀 Generate Your First BOQ Free</button>
          <button className="btn btn-ghost btn-lg" onClick={() => setView('dashboard')}>View Demo Dashboard</button>
        </div>
        <div className="hero-stats">
          <div>
            <div className="hero-stat-val">4 min</div>
            <div className="hero-stat-lbl">Average BOQ time</div>
          </div>
          <div>
            <div className="hero-stat-val">300+</div>
            <div className="hero-stat-lbl">Line items generated</div>
          </div>
          <div>
            <div className="hero-stat-val">±8%</div>
            <div className="hero-stat-lbl">Typical accuracy</div>
          </div>
        </div>

        {/* Mini dashboard preview */}
        <div className="preview-wrap">
          <div className="preview-frame">
            <div className="preview-bar">
              <div className="preview-dot" style={{background:'#FF5F56'}} />
              <div className="preview-dot" style={{background:'#FFBD2E'}} />
              <div className="preview-dot" style={{background:'#27C93F'}} />
              <div className="preview-url">buildcostai.vercel.app/dashboard</div>
            </div>
            <div className="preview-body">
              <div className="preview-sidebar">
                {['Dashboard','Projects','New BOQ','Templates','Clients'].map((l,i) => (
                  <div key={l} className={`preview-nav-item ${i===0?'active':''}`}>
                    <span>{['◼','📁','✦','📄','👤'][i]}</span>{l}
                  </div>
                ))}
              </div>
              <div className="preview-main">
                <div className="preview-header">
                  <div className="preview-h">Dashboard</div>
                  <div className="btn btn-gold" style={{padding:'7px 14px',fontSize:'12px'}}>+ New BOQ</div>
                </div>
                <div className="preview-cards">
                  <div className="preview-card">
                    <div className="preview-card-label">Total BOQs</div>
                    <div className="preview-card-val gold">24</div>
                  </div>
                  <div className="preview-card">
                    <div className="preview-card-label">Project Value</div>
                    <div className="preview-card-val green">£1.2M</div>
                  </div>
                  <div className="preview-card">
                    <div className="preview-card-label">Avg Time</div>
                    <div className="preview-card-val">4 min</div>
                  </div>
                </div>
                <div className="preview-table">
                  <div className="preview-th"><div>Project</div><div>Type</div><div>Value</div><div>Status</div></div>
                  {[
                    ['42 Grasmere Ext.','Extension','£124,800','Complete'],
                    ['Boxton Homes Plot 4','New Build','£287,500','Active'],
                    ['Riverside Loft','Conversion','£68,200','Complete'],
                  ].map(([n,t,v,s]) => (
                    <div className="preview-tr" key={n}>
                      <div style={{fontSize:'12px',fontWeight:600}}>{n}</div>
                      <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{t}</div>
                      <div style={{fontSize:'12px',color:'var(--gold)',fontWeight:700}}>{v}</div>
                      <div><span className={`tag ${s==='Complete'?'tag-green':'tag-gold'}`} style={{fontSize:'10px'}}>{s}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{background:'var(--bg2)', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)'}}>
        <div className="container">
          <div className="section-label">How it works</div>
          <h2 className="section-h">From drawings to BOQ<br />in three steps</h2>
          <div className="steps">
            {[
              { num:'01', icon:'📐', title:'Upload Your Drawings', desc:'Upload architect drawings in PDF, JPG, or PNG. Our AI reads dimensions, specification, and scope directly from the plans.' },
              { num:'02', icon:'⚡', title:'AI Generates Your BOQ', desc:'In minutes, BuildCostAI produces a fully itemised Bill of Quantities: labour, materials, sundries — all broken into UK trades.' },
              { num:'03', icon:'📥', title:'Export & Use', desc:'Download a professional 3-sheet Excel workbook. Pre-filled 2025 rates you can edit. Ready to share with clients or contractors.' },
            ].map(s => (
              <div className="step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div className="container">
          <div className="section-label">Features</div>
          <h2 className="section-h">Everything a UK builder<br />or QS needs</h2>
          <p className="section-sub">Built specifically for UK construction. Not a generic AI tool — a specialist estimating assistant.</p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{background:'var(--bg2)', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)'}}>
        <div className="container">
          <div className="section-label">Testimonials</div>
          <h2 className="section-h">What builders say</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div className="testi-card" key={t.name}>
                <div className="testi-stars">{'★'.repeat(t.stars)}</div>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-author">
                  <div className="testi-avatar">{t.avatar}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="container">
          <div className="section-label">Pricing</div>
          <h2 className="section-h">Simple, transparent pricing</h2>
          <p className="section-sub">Start free. Upgrade when you need more. No hidden fees, no lock-in.</p>
          <div className="pricing-grid">
            {PRICING_PLANS.map(p => (
              <div className={`pricing-card ${p.featured ? 'featured' : ''}`} key={p.name}>
                {p.badge && <div className="pricing-badge">{p.badge}</div>}
                <div className="pricing-name">{p.name}</div>
                <div className="pricing-desc">{p.desc}</div>
                <div className="pricing-price">{p.price}{p.price !== 'Free' && <span>/mo</span>}</div>
                <div className="pricing-period">{p.period}</div>
                <hr className="pricing-divider" />
                <ul className="pricing-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button
                  className={`btn ${p.featured ? 'btn-gold' : 'btn-outline'}`}
                  style={{width:'100%',justifyContent:'center'}}
                  onClick={() => { setView('dashboard'); setShowModal(p.name !== 'Business'); }}
                >
                  {p.featured ? '🚀 Start Free Trial' : p.name === 'Starter' ? 'Get Started Free' : '📞 Contact Josh'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-glow" />
        <h2>Ready to price smarter?</h2>
        <p>Join UK builders saving hours on every estimate. Free to start — no credit card required.</p>
        <div className="cta-actions">
          <button className="btn btn-gold btn-lg" onClick={() => { setView('dashboard'); setShowModal(true); }}>🚀 Generate Your First BOQ Free</button>
          <button className="btn btn-ghost btn-lg">📞 Talk to Josh</button>
        </div>
      </div>

      <footer>
        <div className="nav-logo">
          <div className="nav-logo-icon" style={{width:'28px',height:'28px',fontSize:'14px'}}>🏗</div>
          BuildCost<span>AI</span>
        </div>
        <ul className="footer-links">
          {['Features','Pricing','Privacy','Terms','Contact'].map(l => <li key={l}><a>{l}</a></li>)}
        </ul>
        <div className="footer-copy">© 2025 BuildCostAI · Built in the UK 🇬🇧</div>
      </footer>
    </>
  );
}
