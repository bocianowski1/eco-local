export const emailContent = (email: string, name: string) => {
  return `<div style="display: flex; flex-direction: column; gap: 2rem; background-color: #F5F5F5; padding: 2rem 0;">
  <div style="display: flex; flex-direction: column; align-items: center;">
    <h1 style="font-weight: bold; font-size: 2rem;">Welcome to EcoLocal ${name}</h1>
  </div>
  <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
    <p style="font-weight: lighter;">Please confirm your email</p>
    <a style="background-color: #3b82f6; color: white; padding: 1rem 2rem; border-radius: 5px; font-weight: bold;" href="http://localhost:3000/verify?email=${email}">Verify my email</a>
  </div>
</div>
`;
};
