import { useEffect, useState } from 'react'
import { getTypedObjectKeys } from '@/lib/utils/objects'

const MIN_WIDTH_BREAKPOINTS = {
    smAndLarger: 640,
    mdAndLarger: 768,
    xlAndLarger: 1280,
    '2xlAndLarger': 1536,
}

export function useScreenSize() {
    const [width, setWidth] = useState<number>()

    const screenSize = getTypedObjectKeys(MIN_WIDTH_BREAKPOINTS).find(
        breakpointName => {
            const breakpointMinWidth = MIN_WIDTH_BREAKPOINTS[breakpointName]

            if (!width) {
                return false
            }

            return width >= breakpointMinWidth
        },
    )

    function handleWindowResize() {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        handleWindowResize()

        window.addEventListener('resize', handleWindowResize)

        return () => window.removeEventListener('resize', handleWindowResize)
    }, [])

    return screenSize
}
