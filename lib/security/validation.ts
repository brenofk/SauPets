// Security validation utilities

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "")

  if (cleanCPF.length !== 11) return false

  // Check for known invalid patterns
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  // Validate CPF algorithm
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanCPF.charAt(10))) return false

  return true
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, "")
  return cleanPhone.length === 10 || cleanPhone.length === 11
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push("A senha deve ter pelo menos 6 caracteres")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula")
  }

  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número")
  }

  if (password.length > 128) {
    errors.push("A senha não pode ter mais de 128 caracteres")
  }

  // Check for common weak passwords
  const commonPasswords = ["123456", "password", "123456789", "qwerty", "abc123"]
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Esta senha é muito comum. Escolha uma senha mais segura")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "")
}

export const validatePetName = (name: string): boolean => {
  const sanitized = sanitizeInput(name)
  return sanitized.length >= 1 && sanitized.length <= 50 && /^[a-zA-ZÀ-ÿ\s]+$/.test(sanitized)
}

export const validateVaccineName = (name: string): boolean => {
  const sanitized = sanitizeInput(name)
  return sanitized.length >= 1 && sanitized.length <= 100
}
