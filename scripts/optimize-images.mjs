import { readdir, mkdir, copyFile, stat, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const ROOT = new URL('..', import.meta.url).pathname
const IMGS_DIR = join(ROOT, 'public', 'imgs')
const HIRES_DIR = join(IMGS_DIR, 'alta_risoluzione')

// Map: current filename in public/imgs/ -> new SEO-friendly base name (no extension)
const RENAME_MAP = {
    'manager_tabelle_orari_service.png': 'manager-tabelle-orari',
    'gestionale_completo_service.png': 'gestionale-completo',
    'gestionale_ecommerce_service.png': 'gestionale-ecommerce',
    'ionoleggio_service.png': 'ionoleggio',
    'miapizzeria_service.png': 'miapizzeria',
    'image_describilng_classic_papers_merging_to_digital_elements_5a10xyxgato608l4dplp_0.png':
        'digitalizzazione-documenti',
    'd53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_administrator_in_the_cen_8ugfg51cmh3dbucrj7k3_0.png':
        'automazione-amministrativa',
    'd53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_complex_software_archite_l12o91nah3zhota28knw_0.png':
        'architettura-software-aziendale',
    'image_describilng_classic_papers_merging_to_digital_elements_p0zf8cekfg5i5ucnpws1_3.png':
        'trasformazione-digitale-aziendale',
    'hero_background.png': 'hero-background',
    'hero_dark.png': 'hero-dark',
    'image_describilng_classic_papers_merging_to_digital_elements_7qk99wjvkalhkdd8bkmx_3.png':
        'documenti-cartacei-digitali-alt',
    'd53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_administrator_in_the_cen_nwq25j2cx9uby4y9r7vz_3.png':
        'automazione-amministrativa-alt',
    'd53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_administrator_in_the_cen_54y0j3ag0rm80do95wln_3.png':
        'automazione-amministrativa-alt-2',
    'd53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_complex_software_archite_uiije41cr8x3uwhmpqzf_1.png':
        'architettura-software-alt',
    'd53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_complex_software_archite_r7tq932hn1wfqfzzi7bl_1.png':
        'architettura-software-alt-2',
    'use_palette_-_d53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_industry_i_3s862q07eatgronwo1fp_3.png':
        'industria-automazione',
    // New service images delivered separately by user, dropped into IMGS_DIR with these names:
    'sito-web-standard.png': 'sito-web-standard',
    'documentazione-sicurezza-cantiere.png': 'documentazione-sicurezza-cantiere',
}

const fmtBytes = (b) =>
    b > 1024 * 1024
        ? `${(b / 1024 / 1024).toFixed(2)} MB`
        : `${(b / 1024).toFixed(1)} KB`

async function ensureDir(dir) {
    if (!existsSync(dir)) await mkdir(dir, { recursive: true })
}

async function processOne(originalName, newBaseName) {
    const srcPath = join(IMGS_DIR, originalName)
    if (!existsSync(srcPath)) {
        console.log(`  · skip (not found): ${originalName}`)
        return null
    }
    const ext = extname(originalName).toLowerCase()
    const archivedPath = join(HIRES_DIR, `${newBaseName}${ext}`)
    const webpPath = join(IMGS_DIR, `${newBaseName}.webp`)

    // 1. Copy original (renamed) into alta_risoluzione/
    await copyFile(srcPath, archivedPath)
    const origStat = await stat(archivedPath)

    // 2. Generate optimized webp
    await sharp(srcPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(webpPath)
    const webpStat = await stat(webpPath)

    // 3. Remove the original from public/imgs/ root (only after copy succeeded)
    await unlink(srcPath)

    const ratio = ((1 - webpStat.size / origStat.size) * 100).toFixed(1)
    console.log(
        `  ✓ ${originalName}\n      → alta_risoluzione/${newBaseName}${ext} (${fmtBytes(origStat.size)})\n      → ${newBaseName}.webp (${fmtBytes(webpStat.size)}, -${ratio}%)`,
    )
    return { orig: origStat.size, webp: webpStat.size }
}

async function main() {
    await ensureDir(HIRES_DIR)

    const entries = await readdir(IMGS_DIR, { withFileTypes: true })
    const filesInDir = entries
        .filter((e) => e.isFile())
        .map((e) => e.name)

    console.log(`Optimizing images in ${IMGS_DIR}\n`)

    let totalOrig = 0
    let totalWebp = 0
    const handled = new Set()

    for (const [orig, newBase] of Object.entries(RENAME_MAP)) {
        const result = await processOne(orig, newBase)
        if (result) {
            totalOrig += result.orig
            totalWebp += result.webp
            handled.add(orig)
        }
    }

    // Report unhandled files (not in rename map, not webp, not pdf)
    const leftover = filesInDir.filter(
        (f) =>
            !handled.has(f) &&
            extname(f).toLowerCase() !== '.webp' &&
            extname(f).toLowerCase() !== '.pdf' &&
            !f.startsWith('.'),
    )
    if (leftover.length > 0) {
        console.log('\nFiles in public/imgs/ NOT in rename map (left untouched):')
        leftover.forEach((f) => console.log(`  ? ${f}`))
    }

    if (totalOrig > 0) {
        const overallRatio = ((1 - totalWebp / totalOrig) * 100).toFixed(1)
        console.log(
            `\nTotal: ${fmtBytes(totalOrig)} → ${fmtBytes(totalWebp)} (-${overallRatio}%)`,
        )
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
