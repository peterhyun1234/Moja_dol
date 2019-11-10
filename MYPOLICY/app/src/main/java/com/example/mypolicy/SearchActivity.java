package com.example.mypolicy;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.mypolicy.adapter.PolicyAdapter;
import com.example.mypolicy.model.Policy;
import com.example.mypolicy.service.IApiService;
import com.example.mypolicy.service.RestClient;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SearchActivity extends AppCompatActivity implements View.OnClickListener{

    private String TAG = "SearchActivity";

    private Context mContext = SearchActivity.this;

    private ViewGroup mainLayout;   //사이드 나왔을때 클릭방지할 영역
    private ViewGroup viewLayout;   //전체 감싸는 영역
    private ViewGroup sideLayout;   //사이드바만 감싸는 영역

    private Boolean isMenuShow = false;
    private Boolean isExitFlag = false;

    SharedPreferences sharedPreferences;

    private String mClassName = getClass().getName().trim();
    private RecyclerView mRecyclerView;

    private Spinner spinner1;
    ArrayList<String> locationList;
    ArrayAdapter<String> arrayAdapter;

    private Spinner spinner2;
    ArrayList<String> categoryList;

    private Spinner spinner3;
    ArrayList<String> ageList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        locationList = new ArrayList<>();
        locationList.add("전국");
        locationList.add("경기");
        locationList.add("가평군");
        locationList.add("고양시");
        locationList.add("과천시");
        locationList.add("광명시");
        locationList.add("광주시");
        locationList.add("구리시");
        locationList.add("군포시");
        locationList.add("김포시");
        locationList.add("남양주시");
        locationList.add("동두천시");
        locationList.add("부천시");
        locationList.add("성남시");
        locationList.add("수원시");
        locationList.add("시흥시");
        locationList.add("안산시");
        locationList.add("안성시");
        locationList.add("안양시");
        locationList.add("양평군");
        locationList.add("여주시");
        locationList.add("연천군");
        locationList.add("오산시");
        locationList.add("용인시");
        locationList.add("의왕시");
        locationList.add("의정부시");
        locationList.add("이천시");
        locationList.add("파주시");
        locationList.add("평택시");
        locationList.add("포천시");
        locationList.add("하남시");
        locationList.add("화성시");

            arrayAdapter = new ArrayAdapter<>(getApplicationContext(),
                    android.R.layout.simple_spinner_dropdown_item,
                    locationList);

            spinner1 = (Spinner)findViewById(R.id.spinner1);
            spinner1.setAdapter(arrayAdapter);
            spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                    Toast.makeText(getApplicationContext(),locationList.get(i)+"가 선택되었습니다.",
                            Toast.LENGTH_SHORT).show();
                }
                @Override
                public void onNothingSelected(AdapterView<?> adapterView) {
                }
            });

        categoryList = new ArrayList<>();
        categoryList.add("상관없음");
        categoryList.add("취업지원금, 서류/면접 지원, 취업지원 프로그램");
        categoryList.add("시설/공간 제공, 정책 자금, 멘토링/컨설팅, 사업화");
        categoryList.add("학자금, 대출/이자, 생활보조(금), 결혼/육아, 교통지원");
        categoryList.add("기숙사/생활관, 주택지원, 주거환경지원, 고용장려금, 기업지원금");
        //4.1. Employment_Sup(취업지원) - 취업지원금, 서류/면접 지원, 취업지원 프로그램
        //4.2. Startup_sup(창업지원) - 시설/공간 제공, 정책 자금, 멘토링/컨설팅, 사업화
        //4.3. Life_welfare(생활, 복지) - 학자금, 대출/이자, 생활보조(금), 결혼/육아, 교통지원
        //4.4. Residential_financial(주거, 금융) - 기숙사/생활관, 주택지원, 주거환경지원, 고용장려금, 기업지원금
        arrayAdapter = new ArrayAdapter<>(getApplicationContext(),
                android.R.layout.simple_spinner_dropdown_item,
                categoryList);

        spinner2 = (Spinner)findViewById(R.id.spinner2);
        spinner2.setAdapter(arrayAdapter);
        spinner2.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                Toast.makeText(getApplicationContext(),categoryList.get(i)+"가 선택되었습니다.",
                        Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });

        ageList = new ArrayList<>();
        ageList.add("상관없음");
        ageList.add("청년(18세~34세)");
        ageList.add("중.장년층(35세~65세)");
        ageList.add("어르신(65세 이상)");


        arrayAdapter = new ArrayAdapter<>(getApplicationContext(),
                android.R.layout.simple_spinner_dropdown_item,
                ageList);

        spinner3 = (Spinner)findViewById(R.id.spinner3);
        spinner3.setAdapter(arrayAdapter);
        spinner3.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                Toast.makeText(getApplicationContext(),ageList.get(i)+"가 선택되었습니다.",
                        Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });


        init();
        sharedPreferences = getSharedPreferences("session",MODE_PRIVATE);
        addSideView();  //사이드바 add

        mRecyclerView=findViewById(R.id.recyclerView);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        IApiService iApiService=new RestClient("http://49.236.136.213:3000/").getApiService();
        Call<ArrayList<Policy>> call=iApiService.showAllPolicies();

        try{
            call.enqueue(new Callback<ArrayList<Policy>>() {
                @Override
                public void onResponse(Call<ArrayList<Policy>> call, Response<ArrayList<Policy>> response) {
                    try{
                        PolicyAdapter pa=new PolicyAdapter(response.body());
                        mRecyclerView.setAdapter(pa);
                    }catch(Exception e)
                    {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Call<ArrayList<Policy>> call, Throwable t) {
                        t.printStackTrace();
                }
            });

        }catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        if (keyCode == KeyEvent.KEYCODE_BACK) {
            onBackPressed();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onBackPressed() {

        if(isMenuShow){
            closeMenu();
        }else{

            if(isExitFlag){
                finish();
            } else {

                isExitFlag = true;
                Toast.makeText(this, "뒤로가기를 한번더 누르시면 앱이 종료됩니다.",  Toast.LENGTH_SHORT).show();
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        isExitFlag = false;
                    }
                }, 2000);
            }
        }
    }

    private void init(){

        findViewById(R.id.btn_menu).setOnClickListener(this);

        mainLayout = findViewById(R.id.id_main);
        viewLayout = findViewById(R.id.fl_silde);
        sideLayout = findViewById(R.id.view_sildebar);

    }

    private void addSideView(){

        SideBarView sidebar = new SideBarView(mContext);
        sideLayout.addView(sidebar);

        viewLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });

        sidebar.setEventListener(new SideBarView.EventListener() {

            @Override
            public void btnCancel() {
                Log.e(TAG, "btnCancel");
                closeMenu();
            }

            @Override
            public void btnHome() {
                Log.e(TAG, "btnHome");
                Intent intent = new Intent(mContext, MainActivity.class);
                startActivity(intent);
                closeMenu();
                finish();
            }

            @Override
            public void btnSearch() {
                Intent intent = new Intent(mContext,SearchActivity.class);
                startActivity(intent);
                closeMenu();
                finish();
            }

            @Override
            public void btnDownload() {
                Intent intent = new Intent(mContext,DownloadActivity.class);
                startActivity(intent);
                closeMenu();
                finish();
            }

            @Override
            public void btnProfile() {
                Intent intent = new Intent(mContext,ProfileActivity.class);
                startActivity(intent);
                closeMenu();
                finish();
            }

            @Override
            public void btnLogout() {
                sharedPreferences.edit().clear().apply();
                Intent intent = new Intent(mContext, LoginActivity.class);
                startActivity(intent);
                closeMenu();
                finish();
            }
        });
    }

    @Override
    public void onClick(View view) {

        switch (view.getId()){

            case R.id.btn_menu :

                showMenu();
                break;
        }
    }

    public void closeMenu(){

        isMenuShow = false;
        Animation slide = AnimationUtils.loadAnimation(mContext, R.anim.sidebar_hidden);
        sideLayout.startAnimation(slide);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                viewLayout.setVisibility(View.GONE);
                viewLayout.setEnabled(false);
                mainLayout.setEnabled(true);
            }
        }, 450);
    }

    public void showMenu(){

        isMenuShow = true;
        Animation slide = AnimationUtils.loadAnimation(this, R.anim.sidebar_show);
        sideLayout.startAnimation(slide);
        viewLayout.setVisibility(View.VISIBLE);
        viewLayout.setEnabled(true);
        mainLayout.setEnabled(false);
        Log.e(TAG, "메뉴버튼 클릭");
    }


}
