import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

function wrapText(
  text: string,
  maxCharsPerLine = 80
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if (
      (currentLine + ' ' + word).length >
      maxCharsPerLine
    ) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine +=
        (currentLine ? ' ' : '') + word
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

export async function createProposalPdf(
  clientName: string,
  proposal: string
) {
  const pdfDoc = await PDFDocument.create()

  const page = pdfDoc.addPage([595, 842])

  const font = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  )

  const boldFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  )

  // Header
  page.drawText('CLIENTRADAR', {
    x: 50,
    y: 790,
    size: 28,
    font: boldFont,
  })

  page.drawText(
    'AI-Powered Opportunity Proposal',
    {
      x: 50,
      y: 765,
      size: 12,
      font,
    }
  )

  // Client Info
  page.drawText(`Prepared For: ${clientName}`, {
    x: 50,
    y: 725,
    size: 15,
    font: boldFont,
  })

  page.drawText(
    `Generated: ${new Date().toLocaleDateString()}`,
    {
      x: 50,
      y: 705,
      size: 10,
      font,
    }
  )

  page.drawLine({
    start: { x: 50, y: 685 },
    end: { x: 545, y: 685 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  })

  const sections = proposal
    .split('\n')
    .filter((line) => line.trim())

  let y = 655

  for (const section of sections) {
    const isHeading =
      section.endsWith(':') ||
      section === section.toUpperCase()

    if (isHeading) {
      y -= 8

      page.drawText(section, {
        x: 50,
        y,
        size: 13,
        font: boldFont,
      })

      y -= 24
      continue
    }

    const wrappedLines = wrapText(section, 85)

    for (const wrappedLine of wrappedLines) {
      page.drawText(wrappedLine, {
        x: 50,
        y,
        size: 10,
        font,
      })

      y -= 15

      if (y < 120) break
    }

    y -= 8

    if (y < 120) break
  }

  page.drawLine({
    start: { x: 50, y: 90 },
    end: { x: 300, y: 90 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  })

  page.drawText('Prepared by ClientRadar', {
    x: 50,
    y: 70,
    size: 10,
    font,
  })

  page.drawText(
    'Opportunity Intelligence Platform',
    {
      x: 50,
      y: 55,
      size: 9,
      font,
    }
  )

  return await pdfDoc.save()
}