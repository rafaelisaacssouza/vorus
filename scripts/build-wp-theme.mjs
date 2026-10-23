// Gera o tema WordPress "vorus" a partir do site estático.
// Uso: node scripts/build-wp-theme.mjs  ->  dist/vorus/ e dist/vorus-theme.zip
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const out = join(dist, "vorus");
const zip = join(dist, "vorus-theme.zip");

rmSync(out, { recursive: true, force: true });
rmSync(zip, { force: true });
mkdirSync(join(out, "template-parts"), { recursive: true });

// fs.cpSync derruba o Node 24 no Windows com acento no caminho ("vórus"), então copiamos à mão
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    entry.isDirectory() ? copyDir(src, dest) : copyFileSync(src, dest);
  }
}

for (const dir of ["assets", "css", "js"]) copyDir(join(root, dir), join(out, dir));

// Conteúdo do <body>, com os caminhos de assets apontando para o tema
const html = readFileSync(join(root, "index.html"), "utf8");
const body = html.match(/<body>([\s\S]*?)<script/)[1].trimEnd();
const home = body.replace(
  /(["'])assets\/([^"']+)\1/g,
  (_, q, path) => `${q}<?php echo esc_url( vorus_asset( '${path}' ) ); ?>${q}`
);
if (/(src|href|poster)=["']assets\//.test(home)) throw new Error("Sobrou referência a assets/ não convertida");

const scripts = [...html.matchAll(/<script src="js\/([\w-]+)\.js"><\/script>/g)].map((m) => m[1]);
const pkgVersion = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

const files = {
  "style.css": `/*
Theme Name: Vórus
Theme URI: https://cacal.coop.br
Author: Cacal
Description: Landing page da Vórus, a marca pet da Cacal. Quem cuida, pede Vórus.
Version: ${pkgVersion}
Requires at least: 6.0
Requires PHP: 7.4
License: Proprietary
Text Domain: vorus
*/

/* Os estilos do site ficam em css/styles.css (carregado via functions.php). */
`,

  "functions.php": `<?php
/**
 * Tema Vórus — gerado por scripts/build-wp-theme.mjs. Não edite à mão.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'VORUS_VERSION', '${pkgVersion}' );

function vorus_asset( $path ) {
	return get_theme_file_uri( 'assets/' . $path );
}

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'html5', array( 'script', 'style' ) );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'vorus-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap', array(), null );
	wp_enqueue_style( 'vorus', get_theme_file_uri( 'css/styles.css' ), array( 'vorus-fonts' ), VORUS_VERSION );

	// Estilos de blocos do WP não são usados nesta landing page e podem conflitar com o CSS do site
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );

	$gsap = 'https://unpkg.com/gsap@3/dist/';
	wp_enqueue_script( 'gsap', $gsap . 'gsap.min.js', array(), null, true );
	wp_enqueue_script( 'gsap-scrolltrigger', $gsap . 'ScrollTrigger.min.js', array( 'gsap' ), null, true );
	wp_enqueue_script( 'gsap-customease', $gsap . 'CustomEase.min.js', array( 'gsap' ), null, true );

	$prev = 'gsap-customease';
	foreach ( ${JSON.stringify(scripts).replace(/^\[/, "array( ").replace(/\]$/, " )").replace(/,/g, ", ")} as $name ) {
		wp_enqueue_script( 'vorus-' . $name, get_theme_file_uri( 'js/' . $name . '.js' ), array( 'gsap-scrolltrigger', $prev ), VORUS_VERSION, true );
		$prev = 'vorus-' . $name;
	}
}, 20 );

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
`,

  "header.php": `<!doctype html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Vórus, a marca pet da Cacal: nutrição de qualidade para cães e gatos, com mais de 60 anos de experiência em nutrição animal."
    />
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url( vorus_asset( 'favicon/favicon-32.png' ) ); ?>" />
    <link rel="icon" type="image/png" sizes="192x192" href="<?php echo esc_url( vorus_asset( 'favicon/favicon-192.png' ) ); ?>" />
    <link rel="apple-touch-icon" href="<?php echo esc_url( vorus_asset( 'favicon/apple-touch-icon.png' ) ); ?>" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <?php wp_head(); ?>
  </head>
  <body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
`,

  "footer.php": `
    <?php wp_footer(); ?>
  </body>
</html>
`,

  "index.php": `<?php
get_header();
get_template_part( 'template-parts/home' );
get_footer();
`,

  "template-parts/home.php": home + "\n",
};

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(out, name), content);
}

// Miniatura do tema no painel (opcional): usa o poster do filme se existir
const poster = join(root, "assets/video/vorus-filme-poster.jpg");
if (existsSync(poster)) copyFileSync(poster, join(out, "screenshot.jpg"));

// tar do Windows/bsdtar gera zip com barras "/" (o Compress-Archive do PS 5.1 usa "\\")
const tar = process.platform === "win32" ? join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe") : "bsdtar";
execFileSync(tar, ["-a", "-c", "-f", zip, "-C", dist, "vorus"], { stdio: "inherit" });
console.log(`Tema gerado: ${out}\nZip: ${zip}`);
