import { useEffect, useState } from 'react'
import type {
  BlockNoteEditor,
  BlockSchema,
  InlineContentSchema,
  StyleSchema,
} from '@blocknote/core'

export function useEditorComposing<
  BSchema extends BlockSchema,
  ISchema extends InlineContentSchema,
  SSchema extends StyleSchema,
>(editor: BlockNoteEditor<BSchema, ISchema, SSchema>): boolean {
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    const dom = editor.domElement
    if (!dom) return

    const isInsideEditor = (target: EventTarget | null) =>
      target instanceof Node && dom.contains(target)

    const handleStart = (event: CompositionEvent) => {
      if (!isInsideEditor(event.target)) return
      setIsComposing(true)
    }
    const handleEnd = (event: CompositionEvent) => {
      if (!isInsideEditor(event.target)) return
      setIsComposing(false)
    }

    document.addEventListener('compositionstart', handleStart, true)
    document.addEventListener('compositionend', handleEnd, true)
    return () => {
      document.removeEventListener('compositionstart', handleStart, true)
      document.removeEventListener('compositionend', handleEnd, true)
    }
  }, [editor.domElement])

  return isComposing
}
