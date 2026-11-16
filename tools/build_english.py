#!/usr/bin/env python3
"""Build the English portfolio from Spanish HTML and reviewed translations.

Run from any directory: python3 tools/build_english.py
No runtime translation, framework or third-party Python packages required.
"""
from html import escape, unescape
from html.parser import HTMLParser
import hashlib
import json
import posixpath
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = 'https://darivo.dev'
ROUTES = {
    'index.html': '/en/',
    'proyectos/index.html': '/en/projects/',
    'sobre-mi/index.html': '/en/about/',
    'cv/index.html': '/en/resume/',
    'contacto/index.html': '/en/contact/',
    'proyectos/parking-management/index.html': '/en/projects/parking-management/',
    'proyectos/support-ticket-manager/index.html': '/en/projects/support-ticket-manager/',
    'proyectos/sistema-ventas-yerias/index.html': '/en/projects/sistema-ventas-yerias/',
    'proyectos/lima-real-estate-pipeline/index.html': '/en/projects/lima-real-estate-pipeline/',
    'servicios/index.html': '/en/services/',
}
TRANSLATIONS = json.loads((ROOT / 'i18n/en.json').read_text())
MISSING = set()


def spanish_url(source):
    return '/' if source == 'index.html' else '/' + source.removesuffix('index.html')


def switcher(source, english):
    target = spanish_url(source) if english else ROUTES[source]
    language = 'es' if english else 'en'
    label = 'Cambiar a español' if english else 'Switch to English'
    return ('<!-- language-switcher:start -->'
            '<div class="language-switcher">'
            f'<a href="{target}" lang="{language}" hreflang="{language}" '
            f'aria-label="{label}" title="{label}">{language.upper()}</a></div>'
            '<!-- language-switcher:end -->')


def alternates(source):
    es, en = ORIGIN + spanish_url(source), ORIGIN + ROUTES[source]
    return ('<!-- language-alternates:start -->\n'
            f'<link rel="alternate" hreflang="es" href="{es}">\n'
            f'<link rel="alternate" hreflang="en" href="{en}">\n'
            f'<link rel="alternate" hreflang="x-default" href="{es}">\n'
            '<!-- language-alternates:end -->')


def version_assets(html, page):
    """Keep fresh HTML from reusing a browser's older stylesheet or script."""
    def replace(match):
        attr, value = match.groups()
        parts = urlsplit(unescape(value))
        if parts.scheme or parts.netloc:
            return match[0]
        if not (parts.path.endswith(('.css', '.js')) or parts.path.endswith('/contact-icons.svg')):
            return match[0]
        asset = ((ROOT / parts.path.lstrip('/')) if parts.path.startswith('/')
                 else (page.parent / parts.path)).resolve()
        if not asset.is_relative_to(ROOT) or not asset.is_file():
            raise ValueError(f'Missing local asset in {page}: {value}')
        version = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
        query = [(key, val) for key, val in parse_qsl(parts.query, keep_blank_values=True) if key != 'v']
        query.append(('v', version))
        url = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))
        return f'{attr}="{escape(url, quote=True)}"'
    return re.sub(r'(href|src)="([^"]+)"', replace, html)


def translate(text):
    key = text.strip()
    if not key:
        return text
    if key not in TRANSLATIONS:
        MISSING.add(key)
        return text
    return text[:len(text)-len(text.lstrip())] + TRANSLATIONS[key] + text[len(text.rstrip()):]


def rewrite_url(url, source):
    parts = urlsplit(url)
    if parts.scheme and (parts.scheme not in ('http', 'https') or parts.netloc != 'darivo.dev'):
        return url
    if parts.netloc and parts.netloc != 'darivo.dev':
        return url
    if not parts.path and not parts.netloc:
        return url
    path = parts.path
    if path.startswith('/'):
        resolved = path.lstrip('/')
    else:
        resolved = posixpath.normpath(posixpath.join(posixpath.dirname(source), path))
    if not resolved or resolved == '.':
        resolved = 'index.html'
    if (ROOT / resolved).is_dir():
        resolved = resolved.rstrip('/') + '/index.html'
    dest = ROUTES.get(resolved, '/' + resolved)
    return urlunsplit((parts.scheme, parts.netloc, dest, parts.query, parts.fragment))


class EnglishHTML(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source, self.output = source, []
        self.raw, self.jsonld = None, False

    def handle_decl(self, decl): self.output.append(f'<!{decl}>')
    def handle_comment(self, text): self.output.append(f'<!--{text}-->')
    def handle_entityref(self, name): self.output.append(f'&{name};')
    def handle_charref(self, name): self.output.append(f'&#{name};')

    def start(self, tag, attrs, closing=False):
        original = dict(attrs)
        result = []
        for key, value in attrs:
            if value is None:
                result.append(key)
                continue
            if tag == 'html' and key == 'lang': value = 'en'
            elif key in ('href', 'src', 'action', 'poster'): value = rewrite_url(value, self.source)
            elif key in ('aria-label', 'alt', 'placeholder', 'title', 'data-desc-std', 'data-desc-pro'): value = translate(value)
            elif tag == 'input' and original.get('id') == 'contact-project' and key == 'value': value = translate(value)
            elif key == 'data-value' and tag == 'div': value = translate(value)
            elif tag == 'meta' and key == 'content':
                if original.get('name') in ('description',) or original.get('property') in ('og:title','og:description','twitter:title','twitter:description'):
                    value = translate(value)
                elif original.get('property') in ('og:url','og:image','twitter:url','twitter:image'):
                    value = rewrite_url(value, self.source)
            result.append(f'{key}="{escape(value, quote=True)}"')
        self.output.append('<' + tag + (' ' + ' '.join(result) if result else '') + ('/>' if closing else '>'))
        if tag in ('script','style'):
            self.raw = tag
            self.jsonld = original.get('type') == 'application/ld+json'

    def handle_starttag(self, tag, attrs): self.start(tag,attrs)
    def handle_startendtag(self, tag, attrs): self.start(tag,attrs,True)
    def handle_endtag(self, tag):
        self.output.append(f'</{tag}>')
        if tag == self.raw: self.raw, self.jsonld = None, False

    def handle_data(self, data):
        if self.jsonld:
            def localized(value):
                if isinstance(value,dict): return {k:localized(v) for k,v in value.items()}
                if isinstance(value,list): return [localized(v) for v in value]
                if isinstance(value,str):
                    if value.startswith(ORIGIN): return rewrite_url(value,self.source)
                    return TRANSLATIONS.get(value,{'QA automatizador':'QA automation engineer'}.get(value,value))
                return value
            self.output.append(json.dumps(localized(json.loads(data)),ensure_ascii=False))
        elif self.raw:
            self.output.append(data)
        else:
            self.output.append(escape(translate(data),quote=False))


def main():
    outputs = {}
    for source, destination in ROUTES.items():
        spanish = (ROOT/source).read_text()
        spanish = re.sub(r'<!-- language-alternates:start -->.*?<!-- language-alternates:end -->\n?', '', spanish, flags=re.S)
        spanish = re.sub(r'<!-- language-switcher:start -->.*?<!-- language-switcher:end -->', '', spanish, flags=re.S)
        # Generate from the Spanish source before adding the localized controls.
        parser = EnglishHTML(source)
        parser.feed(spanish)
        english = ''.join(parser.output)
        spanish = spanish.replace('</head>', alternates(source)+'\n</head>')
        english = english.replace('</head>', alternates(source)+'\n</head>')
        spanish = spanish.replace('<div class="site-nav__actions">','<div class="site-nav__actions">'+switcher(source,False))
        english = english.replace('<div class="site-nav__actions">','<div class="site-nav__actions">'+switcher(source,True))
        if source == 'servicios/index.html':
            english = re.sub(r'src="/js/main\.js(?:\?[^"]*)?"', 'src="/js/services.en.js"', english)
        outputs[ROOT/source] = spanish
        outputs[ROOT/destination.lstrip('/')/'index.html'] = english
    if MISSING:
        raise SystemExit('Add reviewed translations to i18n/en.json:\n'+json.dumps(sorted(MISSING),ensure_ascii=False,indent=2))
    # Keep one sitemap; hreflang is declared in each HTML document.
    sitemap = ROOT/'sitemap.xml'
    content = sitemap.read_text()
    content = re.sub(r'\s*<url>\s*<loc>https://darivo\.dev/en/.*?</url>', '', content, flags=re.S)
    entries = '\n'.join(f'  <url><loc>{ORIGIN}{url}</loc></url>' for url in ROUTES.values())
    content = content.replace('</urlset>',entries+'\n</urlset>')
    ET.fromstring(content)
    sitemap.write_text(content)
    script = (ROOT/'js/main.js').read_text()
    script_translations = json.loads((ROOT/'i18n/services-script.en.json').read_text())
    for original, replacement in sorted(script_translations.items(),key=lambda entry:len(entry[0]),reverse=True):
        script = script.replace(original,replacement)
    (ROOT/'js/services.en.js').write_text('// Generated by tools/build_english.py; edit i18n/services-script.en.json.\n'+script)
    # Version after generating scripts so each URL matches its final contents.
    for path, html in outputs.items():
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(version_assets(html, path))
    print(f'Built {len(ROUTES)} English pages and updated their Spanish alternates and sitemap.')


if __name__ == '__main__': main()
