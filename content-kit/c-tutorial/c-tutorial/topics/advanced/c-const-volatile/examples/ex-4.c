int main(void)
{
    int mark = 70;
    const int *view = &mark;
    *view = 80;
    return 0;
}
